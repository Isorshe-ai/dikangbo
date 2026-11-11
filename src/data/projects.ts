// Each project: problem → architecture → technologies → outcomes.
// Outcomes are written qualitatively. Add real numbers (deploy time, cost, uptime) where you have them.
export interface Project {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  architecture: string;
  technologies: string[];
  outcomes: string[];
}

export const projects: Project[] = [
  {
    slug: 'cloud-infrastructure-automation',
    title: 'Cloud Infrastructure Automation',
    summary: 'Provisioned multi-tier AWS environments using Terraform and CloudFormation.',
    problem:
      'Environments were built by hand, so staging and production drifted apart and every new environment took days of careful clicking and documentation.',
    architecture:
      'Reusable Terraform modules describe the network, compute and data tiers, with CloudFormation used where AWS-native stacks fit better. State is stored remotely with locking, and each environment is a separate workspace driven from version control.',
    technologies: ['AWS', 'Terraform', 'CloudFormation', 'GitHub Actions'],
    outcomes: [
      'New environments are created from code in a repeatable, reviewable way.',
      'Configuration drift between environments shows up in plan output instead of in incidents.',
      'Infrastructure changes go through pull requests like application code.',
    ],
  },
  {
    slug: 'gke-cicd-pipeline',
    title: 'GKE CI/CD Pipeline',
    summary: 'Built a Git-to-Concourse pipeline for container deployment on GKE.',
    problem:
      'Releasing to Kubernetes relied on manual steps and tribal knowledge, which made deployments slow and hard to repeat safely.',
    architecture:
      'A commit to Git triggers a Concourse pipeline that tests, builds and publishes a container image, then deploys it to Google Kubernetes Engine. Pipeline definitions live in the repository next to the code they ship.',
    technologies: ['GKE', 'Kubernetes', 'Concourse CI', 'Docker', 'Prometheus', 'Grafana'],
    outcomes: [
      'Deployments are triggered by Git and follow the same path every time.',
      'Pipeline definitions are versioned, so release process changes are reviewed.',
      'Prometheus and Grafana dashboards show the effect of each release.',
    ],
  },
  {
    slug: 'vault-secrets-management',
    title: 'Vault Secrets Management',
    summary: 'Implemented secure secrets handling across environments using Vault.',
    problem:
      'Credentials and tokens were scattered across configuration files and pipelines, with no central way to rotate or audit them.',
    architecture:
      'HashiCorp Vault is the single source of secrets. Workloads and pipelines authenticate to Vault and fetch short-lived credentials at runtime, with policies scoped per environment and per service.',
    technologies: ['HashiCorp Vault', 'Terraform', 'Kubernetes', 'AWS'],
    outcomes: [
      'Secrets are no longer stored in repositories or pipeline variables.',
      'Access is scoped by policy and recorded in an audit log.',
      'Rotating a credential no longer means editing many places by hand.',
    ],
  },
  {
    slug: 'vault-audit-log-tiering',
    title: 'Vault Audit Log Tiering',
    summary: 'Reduced hot audit-log costs by about 85% while keeping a complete cold archive.',
    problem:
      'A high-volume, well-behaved machine client generated most of the audit traffic. Reducing its refresh rate would have undermined self-service, while dropping its records would have weakened audit coverage.',
    architecture:
      'Vault audit events flow to Cloud Logging, then route to a complete cold archive in Cloud Storage and a smaller hot query tier. The hot tier keeps all other events plus a 5% sample of the high-volume client. A sample heartbeat helps detect gaps, and archived records remain available for deeper queries through BigQuery.',
    technologies: ['HashiCorp Vault', 'Google Cloud Logging', 'Cloud Storage', 'BigQuery', 'FinOps'],
    outcomes: [
      'Reduced hot audit-log costs by about 85% without removing events from the complete archive.',
      'Reconciled more than one million audit entries before narrowing the hot tier.',
      'Kept a sampled operational signal to alert if expected records stop arriving.',
    ],
  },
  {
    slug: 'self-service-vault-secrets',
    title: 'Self-Service Secrets Platform',
    summary: 'Enabled product teams to manage workload secrets through guarded self-service.',
    problem:
      'Routine secret changes depended on DevOps, creating a queue and encouraging teams to reuse broad shared secrets.',
    architecture:
      'Vault path conventions and templated policies scope access by team, environment, and workload. A ticket-driven request flow provides an auditable approval path, while Vault Secrets Operator syncs approved values into Kubernetes. Sensitive workloads can receive dedicated credentials rather than sharing a common secret.',
    technologies: ['HashiCorp Vault', 'Vault Secrets Operator', 'Kubernetes', 'IAM', 'GitHub'],
    outcomes: [
      'Product teams can handle routine secret changes without a manual DevOps hand-off.',
      'Templated least-privilege policies make access boundaries repeatable.',
      'Per-workload credentials reduce the blast radius of a compromised secret.',
    ],
  },
  {
    slug: 'kubernetes-observability-alerting',
    title: 'Kubernetes Observability & Alerting',
    summary: 'Restored monitoring coverage and replaced noisy individual alerts with owned routing.',
    problem:
      'Failing scrape targets obscured service health, noisy person-addressed notifications made alerts easy to ignore, and parallel monitoring stacks created overlapping operating costs.',
    architecture:
      'Monitoring coverage and spend were baselined across four Kubernetes clusters before comparing a self-hosted LGTM stack with provider-native monitoring. Alert rules and routing are managed as code, with service ownership and trend-based memory alerts guiding notifications. A pre-decommission inventory identifies dashboards, log sinks, and CI jobs that could recreate a retired stack.',
    technologies: ['Kubernetes', 'Prometheus', 'Grafana', 'Loki', 'Alloy', 'Cloud Monitoring', 'FinOps'],
    outcomes: [
      'Reduced failing scrape targets from 93 to zero.',
      'Introduced a published alerting standard and alert routing as code.',
      'Added predictive memory-exhaustion alerting and planned duplicate-stack decommissioning.',
    ],
  },
  {
    slug: 'reusable-github-actions-deployments',
    title: 'Reusable GitHub Actions Deployment Platform',
    summary: 'Moved application releases to shared workflows with live Helm-state checks.',
    problem:
      'Application deployments relied on different pipeline implementations, making safe cutovers and release reporting difficult to standardize.',
    architecture:
      'Reusable GitHub Actions workflows own the shared build and deployment path. Before each application/environment cutover, the workflow reads the current Helm release state, including image and chart versions, so the new path starts from what is actually deployed. A shared webhook sends deployment events to DORA reporting.',
    technologies: ['GitHub Actions', 'Helm', 'Kubernetes', 'DORA metrics', 'Concourse CI'],
    outcomes: [
      'Migrated deployments from Concourse to versioned, reusable workflows.',
      'Used live release state to make application-by-application cutovers safer.',
      'Centralized deployment reporting without duplicating webhook secrets.',
    ],
  },
  {
    slug: 'restore-first-document-backups',
    title: 'Restore-First Document Backups',
    summary: 'Established a backup and restore programme for previously unprotected clinical documents.',
    problem:
      'Clinical document storage had no established backup programme, and automating copies without proving recoverability would have created false confidence.',
    architecture:
      'A one-off read-only production copy is restored in a development environment first. Automated backups are enabled only after the restore is practised successfully. CRC32C checksums are used to compare objects when evaluating recovery decisions, and unresolved trade-offs are recorded explicitly.',
    technologies: ['Google Cloud Storage', 'CRC32C', 'Backup & Restore', 'Disaster Recovery'],
    outcomes: [
      'Validated that a copy could be restored before turning on recurring backups.',
      'Used checksums to distinguish identical objects from cases needing further review.',
      'Documented asymmetric recovery risks instead of allowing an expiry deadline to decide.',
    ],
  },
  {
    slug: 'on-prem-dhis2-platform',
    title: 'Automated On-Premises DHIS2 Platform',
    summary: 'Built an Ansible-managed platform for operating multiple DHIS2 instances on-premises.',
    problem:
      'Multiple DHIS2 environments needed consistent configuration and repeatable releases without relying on manual server changes or ad hoc recovery steps.',
    architecture:
      'Ansible roles provision containerized DHIS2 services and shared PostgreSQL/PostGIS, with NGINX providing HTTPS virtual hosts and systemd managing service lifecycle. A self-hosted GitHub Actions runner executes scoped deployments on pushes. Backup automation captures database and file data, with scheduled archive verification and a documented restore path.',
    technologies: ['DHIS2', 'Ansible', 'Docker', 'PostgreSQL', 'PostGIS', 'NGINX', 'systemd', 'GitHub Actions'],
    outcomes: [
      'Made multi-instance deployment repeatable through configuration management.',
      'Added HTTPS health checks, reboot-durability checks, and idempotency validation to the rollout process.',
      'Established recurring backups with verification and restore procedures.',
    ],
  },
  {
    slug: 'proxmox-on-prem-kubernetes',
    title: 'Proxmox-Backed On-Premises Kubernetes',
    summary: 'Set up an on-premises Kubernetes cluster on Proxmox for development and staging workloads.',
    problem:
      'Development and staging workloads needed a shared Kubernetes environment running on infrastructure under local operational control.',
    architecture:
      'Proxmox provides the virtualization layer for the on-premises Kubernetes cluster. The cluster hosts non-production workloads across development and staging, keeping the platform close to the systems and teams that use it.',
    technologies: ['Proxmox VE', 'Kubernetes', 'On-Premises Infrastructure', 'Development Environments'],
    outcomes: [
      'Provided a Kubernetes platform for development and staging workloads on local infrastructure.',
      'Extended cloud-native deployment practices into a self-managed environment.',
    ],
  },
  {
    slug: 'private-github-actions-runners-kubernetes',
    title: 'Private GitHub Actions Runners on Kubernetes',
    summary: 'Ran private CI/CD workloads from GitHub Actions runners hosted inside a Kubernetes cluster.',
    problem:
      'Some automation needs to execute from a private environment near internal workloads rather than on shared public runners.',
    architecture:
      'A GitHub Actions workflow targets a private self-hosted runner hosted within Kubernetes. The runner executes the job from inside the cluster environment, where it can work with authorized internal workloads and deployment targets.',
    technologies: ['GitHub Actions', 'Self-Hosted Runners', 'Kubernetes', 'Private Infrastructure'],
    outcomes: [
      'Enabled workflow execution from a private environment inside Kubernetes.',
      'Placed CI/CD execution close to internal deployment targets.',
      'Kept the runner workload within infrastructure managed by the platform team.',
    ],
  },
];
