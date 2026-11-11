---
title: "Platform Engineering: Building an Internal Platform Teams Actually Use"
description: "What platform engineering is, how golden paths and self-service reduce toil, and a practical architecture for an internal platform on AWS and Kubernetes."
pubDate: 2026-10-14
category: Platform Engineering
tags: [Platform Engineering, Golden Paths, Terraform, Kubernetes, DevOps]
related: [securing-github-actions]
---

Most engineering teams do not suffer from a shortage of tools. They suffer from the cost of choosing, wiring and operating those tools again for every new service. Platform engineering is the discipline of paying that cost once, and offering the result to the rest of the organisation as a product.

## What platform engineering is (and is not)

A platform team builds and runs an **internal developer platform (IDP)**: a set of self-service capabilities that let application teams provision infrastructure, ship code and observe it in production without needing to be experts in each underlying system.

It is not a rebrand of the operations team, and it is not a ticket queue with a nicer name. The difference is the operating model. DevOps describes a culture of shared ownership. Platform engineering is one way to make that culture practical at scale, by turning repeated work into reusable, supported paths.

## The layers of a platform

<figure>
  <img src="/images/blog/platform-layers.svg" alt="Layered diagram: application teams use a self-service layer, backed by CI/CD, infrastructure-as-code modules, secrets and observability, running on AWS, GCP and Kubernetes." width="760" height="420" loading="lazy" />
  <figcaption>Figure 1. An internal platform as layers: teams only touch the top, the platform owns the middle, the cloud sits at the bottom.</figcaption>
</figure>

Working from the bottom up:

- **Cloud and runtime.** AWS accounts, GCP projects and Kubernetes clusters, created from code and kept consistent.
- **Platform capabilities.** Pipelines, infrastructure modules, secrets management and observability, each owned and versioned by the platform team.
- **Self-service layer.** Templates, a portal or a CLI, and documentation that expose those capabilities as a few clear choices.

## Golden paths, not golden cages

A golden path is the supported, well-lit way to do a common job, such as "create a new containerised service with a pipeline, secrets and dashboards". Teams that follow it get security, monitoring and upgrades for free. Teams with unusual needs can leave the path, but accept more of the operating burden.

The key design rule is that the path must be **easier than the alternative**. If it is not, people will route around it and the platform becomes shelfware.

### Infrastructure as a module call

The most effective golden path I know is a small, opinionated infrastructure module. An application team writes a few lines; the platform team owns everything behind them.

```hcl
module "service" {
  source  = "git::https://example.com/platform/terraform-service.git?ref=v2.4.0"

  name        = "payments-api"
  environment = "staging"
  owner_team  = "payments"

  # Platform defaults: private networking, encrypted storage,
  # log shipping and a baseline alert set are on unless overridden.
  cpu    = 500
  memory = 1024
}
```

Pinning `ref=v2.4.0` matters. It lets the platform team ship improvements as new versions and lets consumers upgrade on their own schedule, with a changelog to read first.

### A pipeline template teams inherit

The same idea applies to CI/CD. Instead of every repository copying a long pipeline, teams call a shared one.

```yaml
# .github/workflows/deploy.yml in an application repository
name: deploy
on:
  push:
    branches: [main]

jobs:
  release:
    uses: my-org/platform-workflows/.github/workflows/build-and-deploy.yml@v3
    with:
      service: payments-api
      environment: staging
    secrets: inherit
```

Security scanning, image signing and deployment steps live in one place. Fixing a weakness once fixes it for every service.

## Treat the platform as a product

The failure mode of platform teams is building what is technically interesting instead of what developers need. A few habits help:

1. **Talk to your users.** Application teams are your customers. Interview them and watch them use the platform.
2. **Measure outcomes.** Track lead time for changes, deployment frequency, change failure rate and time to restore service (the DORA metrics), plus onboarding time for a new service.
3. **Publish a roadmap and a changelog.** Predictability builds trust.
4. **Keep the surface small.** Every option you expose is something you must support.

## Where to start

You do not need a portal on day one. A sensible order is:

1. Standardise how environments are created, using infrastructure as code with remote state.
2. Provide one reusable pipeline for the most common service type.
3. Centralise secrets and observability defaults.
4. Only then add a portal or catalogue to make these paths discoverable.

## Takeaways

Platform engineering works when it removes toil that application teams would otherwise repeat, and when the supported path is the easiest path. Start with the highest-friction, highest-repetition task, make it self-service, measure the effect, and grow from there.

## References

- [CNCF Platforms White Paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/), CNCF TAG App Delivery.
- [Team Topologies](https://teamtopologies.com/), on platform teams and team interaction modes.
- [DORA research and the four key metrics](https://dora.dev/).
- [Backstage](https://backstage.io/), an open source framework for developer portals.
- [Terraform module documentation](https://developer.hashicorp.com/terraform/language/modules), HashiCorp.
