---
title: "Building a Private Kubernetes Platform on Proxmox"
description: "A practical pattern for running development and staging Kubernetes workloads on Proxmox, with private GitHub Actions runners hosted inside the cluster."
pubDate: 2026-11-11
category: Platform Engineering
tags: [Proxmox, Kubernetes, GitHub Actions, Self-Hosted Runners, On-Premises]
related: [platform-engineering-internal-platform, securing-github-actions]
---

Not every workload belongs in a public cloud. Development and staging systems may need to run near on-premises services, use existing virtualization capacity, or stay within infrastructure the team operates directly.

I set up an on-premises Kubernetes environment on Proxmox for development and staging workloads, and separately hosted private GitHub Actions runners inside a Kubernetes cluster. Together, these patterns bring both application runtime and selected CI/CD execution into privately managed infrastructure.

## Platform architecture

Proxmox provides the virtualization foundation. Kubernetes supplies a consistent workload platform above it, while development and staging workloads remain the purpose of the environment. Private GitHub Actions runners execute selected workflows from within the cluster environment.

<figure>
  <img src="/images/blog/proxmox-kubernetes-private-runners.svg" alt="Proxmox underpins an on-premises Kubernetes platform hosting development workloads, staging workloads, and private GitHub Actions runners. GitHub workflows target the private runners, which execute jobs from within the cluster environment." width="1000" height="560" loading="lazy" />
  <figcaption>Figure 1. Virtualization, Kubernetes workloads, and private workflow execution in an on-premises platform.</figcaption>
</figure>

The goal is not to recreate every cloud service on-premises. It is to provide a clear place for the workloads that benefit from local control, while preserving familiar Kubernetes and GitHub Actions workflows.

## Why host runners privately?

Some deployment jobs need to operate close to services that are not reachable from a public runner. A private runner hosted inside Kubernetes gives those workflows an execution point within the environment where the workload lives.

Keep the trust boundary explicit:

- Restrict which repositories and workflows can use the private runner.
- Separate deployment permissions from ordinary build and test jobs.
- Keep credentials in protected secret storage and expose them only to the job that needs them.
- Make the deployment target and environment explicit in workflow configuration.
- Keep runner images, permissions, and lifecycle under platform-team ownership.

The precise runner controller and isolation model depend on the cluster and repository requirements; the architectural point is that workflow execution is private and operated as part of the platform rather than assumed to be a public, disposable build agent.

## Operating development and staging

Development and staging are useful places to validate both the application path and the platform itself. Keep changes reviewable, define how each environment is updated, and ensure the runner cannot silently widen a deployment from one environment to another.

Proxmox adds a virtualization layer that must also be considered in capacity and maintenance planning. Kubernetes resource requests and limits do not remove the need to monitor the underlying compute and storage resources that back the cluster.

## Trade-offs

Self-managed infrastructure gives the team control over placement and connectivity, but also makes the team responsible for platform availability, upgrades, capacity, and recovery. Private runners add another privileged service to patch, monitor, and restrict.

Start with a small supported workload set and a clear operational owner. Expand only when the team can explain how the cluster is maintained and how each runner is authorized to act.

## Takeaways

A private Kubernetes platform can extend cloud-native practices to local infrastructure, and private runners can bring CI/CD execution to the workloads that need it. Treat the hypervisor, cluster, runner, and workflow permissions as one operating system—with explicit ownership and boundaries at every layer.
