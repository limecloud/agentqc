---
title: v0.5.0 overview
description: Agent QC v0.5.0 overview.
---

# v0.5.0 overview

Agent QC v0.5.0 expands the standard protocol with a richer testing-technique layer. It adds explicit guidance for snapshots, smoke tests, black-box, white-box, gray-box, replay, chaos, security/adversarial checks, runtime/UI/skills testing, and composed evidence braids.

## Highlights

- Adds a dedicated [Test techniques and compositions](../../authoring/test-techniques-and-compositions) authoring page.
- Defines a reusable evidence braid: white-box invariant -> protocol/contract -> black-box run -> surface artifact -> cleanup/review.
- Expands snapshot standards across text transcripts, terminal frames, DOM/ARIA, screenshots/videos, protocol/schema snapshots, runtime state, and package manifests.
- Adds smoke-test levels for import/build, runtime, surface, release, and live canary checks.
- Adds focused guidance for testing Agent runtime, Agent UI, skills/plugins, browser agents, channel gateways, schedulers, provider adapters, and release artifacts.
- Reframes generic docs as a product-neutral protocol and keeps product-specific pages only as legacy compatibility or explicit examples.
