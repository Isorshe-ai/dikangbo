export const resumeProfiles = [
  {
    id: 'devops',
    label: 'DevOps Engineer',
    summary:
      'DevOps Engineer focused on reliable, secure delivery across cloud and Kubernetes environments. Experienced in CI/CD, infrastructure automation, secrets management, observability, and production recovery.',
    skills: ['AWS', 'Google Cloud', 'Kubernetes / GKE', 'GitHub Actions', 'Terraform / OpenTofu', 'HashiCorp Vault', 'Ansible', 'Prometheus'],
    caseStudies: ['reusable-github-actions-deployments', 'vault-audit-log-tiering', 'restore-first-document-backups'],
  },
  {
    id: 'platform',
    label: 'Platform Engineer',
    summary:
      'Platform Engineer who builds secure, reusable foundations that help product teams ship and operate services with confidence. Focused on Kubernetes, developer self-service, observability, and reliable release workflows.',
    skills: ['Kubernetes / GKE', 'Helm', 'Proxmox VE', 'GitHub Actions', 'HashiCorp Vault', 'Vault Secrets Operator', 'Prometheus', 'Grafana'],
    caseStudies: ['self-service-vault-secrets', 'kubernetes-observability-alerting', 'proxmox-on-prem-kubernetes'],
  },
  {
    id: 'architect',
    label: 'Solutions Architect',
    summary:
      'Solutions Architect and Cloud Engineer translating product and operational needs into practical, maintainable infrastructure. Experienced designing cloud and hybrid platforms, deployment workflows, and application hosting for diverse organizations.',
    skills: ['AWS', 'Google Cloud', 'Terraform / OpenTofu', 'CloudFormation', 'Docker', 'Ansible', 'PostgreSQL / PostGIS', 'NGINX'],
    caseStudies: ['cloud-infrastructure-automation', 'on-prem-dhis2-platform', 'gke-cicd-pipeline'],
  },
] as const;

export const resumeLastUpdated = '13 November 2026';

const achievement = (text: string, projectSlug?: string) => ({ text, projectSlug });

export const experience = [
  {
    date: 'Dec 2024 – Present',
    role: 'DevOps Engineer',
    company: 'eHealth Africa',
    highlights: [
      achievement('Designed a developer self-service secrets platform using HashiCorp Vault and Vault Secrets Operator, with templated least-privilege policies and a ticket-driven access flow.', 'self-service-vault-secrets'),
      achievement('Reworked Vault audit-log routing into hot and cold tiers, reducing hot-log costs by about 85% while retaining a complete archive; reconciled more than one million entries before rollout.', 'vault-audit-log-tiering'),
      achievement('Led observability and alerting improvements across four Kubernetes clusters, taking failing scrape targets from 93 to zero and introducing alert routing as code.', 'kubernetes-observability-alerting'),
      achievement('Migrated application deployments from Concourse to reusable GitHub Actions workflows that inspect live Helm release state before cutover; added DORA reporting.', 'reusable-github-actions-deployments'),
      achievement('Improved production reliability through container memory right-sizing, Celery worker liveness checks, and a restore-tested backup programme for clinical documents.', 'restore-first-document-backups'),
      achievement('Automated a production-grade, multi-instance on-prem DHIS2 deployment with Ansible, containerized services, HTTPS reverse-proxy routing, push-triggered deployment, and scheduled backup verification.', 'on-prem-dhis2-platform'),
      achievement('Established an on-premises Kubernetes environment on Proxmox and private GitHub Actions runners for development and staging workloads.', 'proxmox-on-prem-kubernetes'),
    ],
  },
  {
    date: '2022 – 2023',
    role: 'Freelance DevOps Consultant',
    company: 'LearnDeo',
    url: 'https://learndeo.ng',
    highlights: [
      achievement('Containerized and redeployed the e-learning platform, moving from a monolithic deployment to a portable Docker-based architecture.'),
      achievement('Redesigned the deployment pipeline to support safer releases and faster product iteration, then documented the system for handover to the internal team.'),
    ],
  },
  {
    date: 'Nov 2021 – Jul 2022',
    role: 'IT Lead & Cloud Engineer',
    company: 'CUST Commodities West Africa · Abuja',
    highlights: [
      achievement('Deployed and maintained Odoo ERP and a laboratory management system on DigitalOcean, containerizing both with Docker for more consistent deployments.'),
      achievement('Maintained the company website and digital assets, managed network and compute resources, and trained staff on internal digital tools.'),
    ],
  },
  {
    date: '',
    role: 'Solutions Architect / Cloud Engineer',
    company: 'Dibia Solutions Limited · Abuja',
    url: 'https://dibia.cloud',
    highlights: [
      achievement('Designed, built, and managed cloud infrastructure and deployment for web applications, including a scholars and alumni community platform, a voter-education platform, and solar sales and estimation tools.'),
      achievement('Contributed to the infrastructure and delivery of Dibia’s cloud application portfolio.'),
    ],
  },
];

export const skills = [
  {
    category: 'Cloud & infrastructure',
    items: ['AWS', 'Google Cloud', 'Terraform / OpenTofu', 'CloudFormation', 'IAM', 'Linux'],
  },
  {
    category: 'Platforms & delivery',
    items: ['Kubernetes / GKE', 'Helm', 'Docker', 'GitHub Actions', 'Concourse CI', 'Ansible'],
  },
  {
    category: 'Security & reliability',
    items: ['HashiCorp Vault', 'Vault Secrets Operator', 'Keycloak', 'Prometheus', 'Grafana', 'Incident response'],
  },
  {
    category: 'Automation & operations',
    items: ['Python', 'Bash', 'PostgreSQL / PostGIS', 'Redis', 'Celery', 'Backup & recovery'],
  },
];

export const volunteering = [
  'Cloud Track Mentor, Google Africa Developer Scholarship (2021)',
  'Web Development Mentor, eHA Academy Cohort 6 (2024)',
  'Member, Internet Society Nigeria Chapter and Rural Development Special Interest Group',
];

export const education = [
  'PhD in Computer Science (In View) – Nasarawa State University',
  'MSc ICT – Bayero University Kano',
  'Google Africa Developer Scholarship, Cloud Track (2020)',
  'Web Design Fundamentals, eHA Academy (2020)',
];
