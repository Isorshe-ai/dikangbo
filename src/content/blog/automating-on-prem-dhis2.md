---
title: "Automating Multi-Instance DHIS2 on On-Premises Infrastructure"
description: "A repeatable DHIS2 operations pattern using Ansible, containers, HTTPS reverse proxying, scoped GitHub Actions deployments, and restore-verified backups."
pubDate: 2026-11-11
category: DevOps
tags: [DHIS2, Ansible, On-Premises, GitHub Actions, PostgreSQL, Backup & Restore]
related: [platform-engineering-internal-platform, vault-audit-log-tiering]
---

Operating more than one DHIS2 environment on a single on-premises host can quickly become a configuration-drift problem. Each instance has its own application settings and database, but the platform around them—runtime, network entry point, service lifecycle, backups, and release process—should be predictable.

The goal of this design was to make a multi-instance DHIS2 platform repeatable to deploy and straightforward to recover. The implementation documented here is a development platform built with production-oriented operational controls; hostnames, network details, and instance names are intentionally omitted.

## Architecture

Ansible is the control plane for host and service configuration. It provisions the container runtime, shared PostgreSQL/PostGIS service, DHIS2 instances, reverse-proxy routes, and service units. GitHub Actions runs on a private self-hosted runner at the deployment host, so a repository change can converge only the affected instance.

<figure>
  <img src="/images/blog/on-prem-dhis2-platform.svg" alt="Ansible and encrypted configuration manage a Linux host running multiple DHIS2 containers and a shared PostgreSQL/PostGIS service. NGINX routes HTTPS traffic to each instance; systemd manages service lifecycle; a private GitHub Actions runner triggers scoped Ansible deployments. Backups are verified and can be restored." width="1000" height="590" loading="lazy" />
  <figcaption>Figure 1. A configuration-managed, multi-instance DHIS2 host with scoped deployment and a verified recovery path.</figcaption>
</figure>

The pattern separates responsibilities:

- **Ansible roles** configure shared host dependencies and each instance from versioned data.
- **Containers** isolate DHIS2 application processes; PostgreSQL/PostGIS provides the database service.
- **NGINX and HTTPS** provide a stable public entry point and route requests to the right instance.
- **systemd** brings services back after restarts and provides an operating-system level lifecycle.
- **A private runner** executes deployment jobs from the environment that can reach the host.
- **Backup automation** captures database and file data, with verification and restore instructions.

## Make each instance a data-driven deployment

The deployment should describe the differences between instances—such as the DHIS2 version, database name, and application settings—as data, while keeping shared behavior in reusable Ansible roles.

That structure makes a single-instance rollout possible without forking the whole platform. It also makes idempotency testable: a converged host should not report unexpected changes on a subsequent check-mode run.

The same principle applies to imported apps and metadata. Keep instance-specific inputs in version control, make the import step repeatable, and keep administrative credentials out of command-line arguments and source files.

## Put deployment close to the target, with deliberate scope

A self-hosted GitHub Actions runner can execute the deployment workflow from the private environment. A useful release flow is:

1. Detect which instance configuration changed.
2. Run the deployment for only that instance.
3. Perform an HTTPS health check against its DHIS2 system endpoint.
4. Report a failed deploy or health check clearly instead of treating a completed playbook as proof of application health.

The runner is a privileged component because it can change services and read deployment credentials. Limit which repositories and workflows can schedule work there, keep credentials in protected secret storage, and make the scope of each deployment explicit.

## Treat recovery as part of deployment

Creating backup files is not enough. The operating model should also:

- back up both database dumps and required files;
- alert on backup job failures, not only successful runs;
- periodically verify that database dumps can be read;
- document and practise restoring into a scratch database before a real recovery is needed;
- confirm that services return after a host reboot.

Those checks turn recovery from an assumption into an operational capability.

## Trade-offs and limits

A shared host is simple to operate, but it couples instance capacity to one machine and one database service. Resource budgets and health checks matter as the number of instances grows. For larger or higher-availability deployments, the same configuration-driven model can be retained while moving workloads onto a more resilient compute and database architecture.

## Takeaways

The durable part of an on-premises DHIS2 deployment is not a particular container command. It is the repeatable operating model around it: declarative instance configuration, idempotent automation, scoped releases, observable health, and a restore path that has actually been checked.
