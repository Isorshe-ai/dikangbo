---
title: "Securing GitHub Actions: Least Privilege, Pinned Actions and OIDC"
description: "A practical hardening guide for GitHub Actions: restrict token permissions, pin third-party actions, avoid script injection and replace long-lived cloud keys with OIDC."
pubDate: 2026-11-05
category: Security
tags: [GitHub Actions, CI/CD, Supply Chain, OIDC, AWS]
related: [platform-engineering-internal-platform]
---

A CI/CD pipeline is a privileged system. It can read your source, build your artefacts and often deploy straight to production. That makes it an attractive target, and GitHub Actions workflows deserve the same scrutiny as the code they ship.

This guide covers four changes that remove the most common risks, with copy-ready examples.

## 1. Give the workflow token the minimum permissions

Every job receives a `GITHUB_TOKEN`. Depending on repository and organisation settings, its default scope can be broader than the job needs. Set a restrictive default at the top of each workflow and grant more only where required.

```yaml
name: ci
on: [pull_request]

# Deny by default; grant per job.
permissions: {}

jobs:
  test:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm test
```

You can also set the default token permission to read-only in the repository or organisation settings, so a workflow that forgets the block fails safe.

## 2. Pin third-party actions to a commit SHA

A tag such as `@v4` can be moved. If an action's repository is compromised, a retagged release runs attacker code inside your pipeline with access to your secrets. This is not hypothetical: in March 2025 the popular `tj-actions/changed-files` action was compromised and tracked as CVE-2025-30066, causing secrets to be printed into workflow logs for repositories that used it.

Pin to a full-length commit SHA and keep a comment with the human-readable version:

```yaml
steps:
  # actions/checkout v4.x, pinned to an immutable commit
  - uses: actions/checkout@<full-40-character-commit-sha>
```

Let Dependabot raise pull requests when new versions appear, so pinning does not mean falling behind:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

## 3. Treat untrusted input as untrusted

Expressions such as `${{ github.event.pull_request.title }}` are substituted into the script **before** the shell runs. A crafted title can therefore become a command.

```yaml
# Vulnerable: the title is pasted into the shell script
- run: echo "Building ${{ github.event.pull_request.title }}"

# Safer: pass it as an environment variable, then quote it
- env:
    PR_TITLE: ${{ github.event.pull_request.title }}
  run: echo "Building $PR_TITLE"
```

Be especially careful with the `pull_request_target` trigger. It runs with access to repository secrets and a write-scoped token in the context of the base repository. Never check out and execute code from a fork's pull request inside such a workflow.

## 4. Replace long-lived cloud keys with OIDC

Storing `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` as repository secrets creates a credential that never expires and can be copied out. OpenID Connect lets a job exchange a short-lived, signed identity token for temporary cloud credentials instead.

<figure>
  <img src="/images/blog/oidc-flow.svg" alt="Flow diagram: a workflow job requests an OIDC token from GitHub, presents it to AWS STS, receives short-lived credentials, then calls AWS APIs." width="760" height="300" loading="lazy" />
  <figcaption>Figure 1. OIDC federation: no stored cloud keys, and credentials expire when the job ends.</figcaption>
</figure>

On the AWS side, the IAM role's trust policy decides which repositories and branches may assume it. The `sub` condition is the important part: without it, any repository on GitHub could try.

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub": "repo:my-org/my-repo:ref:refs/heads/main"
      }
    }
  }]
}
```

The workflow then requests the token and assumes the role:

```yaml
permissions:
  id-token: write   # required to request the OIDC token
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production   # add required reviewers on this environment
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::<ACCOUNT_ID>:role/gha-deploy
          aws-region: us-east-1
      - run: aws sts get-caller-identity
```

Pair this with a GitHub **environment** that requires a reviewer for production. The trust policy can then also match `environment:production` in the `sub` claim, so only approved deployments can obtain production credentials.

## A quick checklist

- Workflow `permissions` set to the minimum, per job.
- Third-party actions pinned to commit SHAs, with Dependabot enabled.
- No untrusted `${{ }}` expressions inside `run:` scripts.
- `pull_request_target` avoided, or never used with untrusted code.
- OIDC instead of stored cloud keys, with a narrow `sub` condition.
- Branch protection and required reviews on workflow files themselves.

## Takeaways

None of these changes needs new tooling. They narrow what a compromised dependency or a malicious pull request can reach. Start with permissions and OIDC, then add pinning and review rules.

## References

- [Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions), GitHub Docs.
- [About security hardening with OpenID Connect](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/about-security-hardening-with-openid-connect), GitHub Docs.
- [Configuring OpenID Connect in Amazon Web Services](https://docs.github.com/en/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services), GitHub Docs.
- [CVE-2025-30066](https://nvd.nist.gov/vuln/detail/CVE-2025-30066), `tj-actions/changed-files` compromise, NIST NVD.
- [OpenSSF Scorecard](https://scorecard.dev/), automated checks for supply chain practices.
