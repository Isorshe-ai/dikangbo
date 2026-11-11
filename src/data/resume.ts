export const resumeSummary =
  'DevOps and Platform Engineer focused on making cloud infrastructure secure, reliable, and easier to operate. Experienced across Kubernetes, AWS and Google Cloud, CI/CD automation, secrets management, observability, and backup and recovery for healthcare, financial services, and mission-driven organizations.';

export const experience = [
  {
    date: 'Dec 2024 – Present',
    role: 'DevOps Engineer',
    company: 'eHealth Africa',
    highlights: [
      'Designed a developer self-service secrets platform using HashiCorp Vault and Vault Secrets Operator, with templated least-privilege policies and a ticket-driven access flow.',
      'Reworked Vault audit-log routing into hot and cold tiers, reducing hot-log costs by about 85% while retaining a complete archive; reconciled more than one million entries before rollout.',
      'Led observability and alerting improvements across four Kubernetes clusters, taking failing scrape targets from 93 to zero and introducing alert routing as code.',
      'Migrated application deployments from Concourse to reusable GitHub Actions workflows that inspect live Helm release state before cutover; added DORA reporting.',
      'Improved production reliability through container memory right-sizing, Celery worker liveness checks, and a restore-tested backup programme for clinical documents.',
      'Automated a production-grade, multi-instance on-prem DHIS2 deployment with Ansible, containerized services, HTTPS reverse-proxy routing, push-triggered deployment, and scheduled backup verification.',
      'Established an on-premises Kubernetes environment on Proxmox and private GitHub Actions runners for development and staging workloads.',
    ],
  },
  {
    date: '2022 – 2023',
    role: 'Freelance DevOps Consultant',
    company: 'LearnDeo',
    url: 'https://learndeo.ng',
    highlights: [
      'Containerized and redeployed the e-learning platform, moving from a monolithic deployment to a portable Docker-based architecture.',
      'Redesigned the deployment pipeline to support safer releases and faster product iteration, then documented the system for handover to the internal team.',
    ],
  },
  {
    date: 'Nov 2021 – Jul 2022',
    role: 'IT Lead & Cloud Engineer',
    company: 'CUST Commodities West Africa · Abuja',
    highlights: [
      'Deployed and maintained Odoo ERP and a laboratory management system on DigitalOcean, containerizing both with Docker for more consistent deployments.',
      'Maintained the company website and digital assets, managed network and compute resources, and trained staff on internal digital tools.',
    ],
  },
  {
    date: '',
    role: 'Solutions Architect / Cloud Engineer',
    company: 'Dibia Solutions Limited · Abuja',
    url: 'https://dibia.cloud',
    highlights: [
      'Designed, built, and managed cloud infrastructure and deployment for web applications, including a scholars and alumni community platform, a voter-education platform, and solar sales and estimation tools.',
      'Contributed to the infrastructure and delivery of Dibia’s cloud application portfolio.',
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
