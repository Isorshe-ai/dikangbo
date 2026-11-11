---
title: "Cutting Vault Audit-Log Costs Without Losing the Audit Trail"
description: "How a hot-and-cold Vault audit-log design reduced hot-tier costs by about 85%, preserved a complete archive, and was validated against more than one million entries."
pubDate: 2026-11-11
category: Security
tags: [HashiCorp Vault, Audit Logging, Google Cloud, FinOps, BigQuery]
related: [securing-github-actions, platform-engineering-internal-platform]
---

Audit logs are only useful when they are complete, searchable, and affordable to retain. In one Kubernetes platform, a single well-behaved machine client generated most of the Vault audit volume. Reducing its refresh rate would have hurt the self-service workflow, so the better lever was where the events were kept hot.

The change was a tiering decision, not a decision to stop recording events: keep the complete stream in a lower-cost archive, while narrowing the more expensive operational query tier.

## The architecture

Every Vault audit event continued into Cloud Logging. From there, routing sent the full stream to a cold Cloud Storage archive. The hot tier kept the other events plus a 5% sample of the high-volume client. That sample also acted as a heartbeat: if it stopped arriving, an alert could flag a possible gap in the route.

<figure>
  <img src="/images/blog/vault-audit-log-architecture.svg" alt="Vault audit events flow into Cloud Logging. All events are archived in Cloud Storage; a hot query tier keeps other events and a five percent sample from a high-volume machine client. BigQuery queries the archive, and the sample feeds a heartbeat alert." width="1000" height="560" loading="lazy" />
  <figcaption>Figure 1. The hot tier is narrowed, but the complete event stream still has an archive path.</figcaption>
</figure>

This separation made the cost lever explicit:

- **Cold archive:** retain every audit event for investigation and compliance needs.
- **Hot query tier:** keep the events most useful for day-to-day operations, plus a small sample of the high-volume client.
- **Heartbeat:** alert if the expected sample stops arriving rather than assuming a quiet stream is healthy.
- **Historical queries:** use BigQuery when an investigation needs the archived records.

The sample is not a substitute for the archive. It is an operational signal; the cold copy remains the source for full-history queries.

## Prove completeness before changing the route

The risky part was not configuring a sink. It was proving that the proposed route did not discard or misclassify events. Before narrowing the hot tier, more than one million audit entries were reconciled one by one against the complete stream.

That exercise served as a safety gate: first establish that the archive has the full record, then enable the hot-tier filter, then verify both paths. The implementation also documented residual risks and who could still read the archive.

<figure>
  <img src="/images/blog/vault-audit-log-validation.svg" alt="Four-step audit-log validation: reconcile more than one million entries with the archive, verify hot and cold routing, monitor the sample heartbeat, and handle timestamp precision and late-arriving hourly files in queries." width="1000" height="430" loading="lazy" />
  <figcaption>Figure 2. Validation checks for completeness, routing, monitoring, and historical-query edge cases.</figcaption>
</figure>

## Query details can look like missing data

Two details made historical validation less straightforward than it first appeared:

1. **Timestamp precision.** Vault audit timestamps can include nanoseconds, while a query engine may not parse that representation directly. Normalize or split the timestamp at ingestion/query time, and validate the conversion against known records.
2. **Late-arriving files.** Hourly archive files may arrive after the hour they describe. A query that checks only the newest time window can temporarily look incomplete. Allow for ingestion delay before treating a gap as data loss.

These are not reasons to weaken verification. They are reasons to make the query model match the actual data format and delivery timing.

## Results and operating lessons

The hot audit-log cost fell by about **85%**, while the cold archive retained the complete stream. The key design choices were:

- Reduce expensive hot retention before reducing the source event generation.
- Keep a complete, lower-cost archive for full-fidelity investigation.
- Use a small sample as an active signal that the route is still working.
- Reconcile real entries before narrowing the filter, then verify both destinations after the change; do not rely only on configuration review.
- Document timestamp and ingestion-delay behavior so normal query lag does not trigger a false incident.
- Keep archive access and retention controls explicit in the security decision record.

The useful question is not "How do we log less?" It is "Which records must be immediately searchable, which must remain recoverable, and how will we prove both paths are working?"

## Takeaways

Treat audit logging as a data lifecycle. Route all events to a complete archive, reserve the hot tier for operational needs, and make the validation plan part of the architecture. Cost optimization is only a success when the evidence trail remains intact and the team can detect when collection breaks.
