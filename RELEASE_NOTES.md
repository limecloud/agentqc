# Release Notes

## v0.5.0

Agent QC v0.5.0 adds the missing testing-technique layer for advanced Agent quality control. It turns gate families into concrete, composable evidence strategies: snapshots, smoke tests, black-box and white-box checks, gray-box runtime/UI validation, replay, chaos, security/adversarial checks, semantic eval, and release install proof.

### Highlights

- Adds a dedicated testing-techniques page for snapshots, smoke levels, black-box/white-box/gray-box modes, runtime testing, UI testing, and skills/plugins lifecycle testing.
- Defines reusable evidence braids such as runtime + UI, TUI approval, provider adapter, browser agent safety, channel gateway, scheduler recovery, skill/plugin lifecycle, and release confidence.
- Expands snapshot standards for text/golden transcripts, terminal frames, DOM/ARIA trees, screenshots/videos, protocol/schema snapshots, runtime state, and package manifests.
- Clarifies smoke-test levels: import/build, runtime, surface, release, and opt-in live canary.
- Reframes current generic pages as a product-neutral standard protocol; product-specific content is kept only in legacy compatibility, version-history, or explicit example pages.
- Refreshes navigation, README, source index, LLM entrypoints, public schemas, examples, and version pages for `0.5.0`.

### Scope

This release remains documentation- and schema-version focused. It does not mandate one test framework. It standardizes the evidence shapes and composition logic that Agent projects can map to their local toolchains.

## v0.4.0

Agent QC v0.4.0 turns the v0.3.0 case-study expansion into a fuller standard surface. It incorporates Agent UI's runtime-backed projection practices, Agent Skills-style progressive disclosure, and concrete evidence patterns from representative runtime, TUI, gateway, scheduler, UI, release, and eval systems.

### Highlights

- Adds best-practice guidance for risk-owned classification, fact ownership, qcloop boundaries, and evidence-first reports.
- Adds a full flow/taxonomy reference covering profiles, surfaces, gates, evidence kinds, verdict statuses, fact owners, case envelopes, and report envelopes.
- Adds an evidence contract for evidence refs, verdict objects, gate minimums, surface add-ons, waiver rules, and anti-patterns.
- Adds performance and reliability metrics for runtime responsiveness, stream health, tool/permission reliability, GUI/TUI/WebUI/browser evidence, scheduler recovery, and release smoke.
- Expands quickstart, gate matrix, project classification, acceptance scenarios, and evidence-driven verdicts with product-neutral protocol wording.
- Refreshes LLM entrypoints, navigation, source index, README, and public schema/examples for `0.4.0`.

### Scope

This release is documentation- and schema-version focused. It does not introduce a new framework requirement; it standardizes stronger evidence shapes that any Agent project can map to its own test stack.

## v0.3.0

Agent QC v0.3.0 deepens the standard with concrete testing systems from major Agent projects. It focuses on how runtime, TUI, GUI, WebUI, gateway, background, and release tests should be shaped and evidenced.

### Highlights

- Adds a detailed interaction surface testing guide for CLI streams, TUI, WebUI, desktop GUI, browser automation, mobile/channel adapters, and semantic eval UIs.
- Expands case studies for representative Agent project shapes with concrete gates, evidence, fixtures, and anti-patterns.
- Adds a Claude Code-style TUI/runtime QC example and expands public JSON samples for representative Agent project shapes and qcloop.
- Clarifies that TUI/WebUI/GUI/browser/channel/eval tests need surface-specific evidence, not just a generic `ui-interaction` label.

### Scope

This release is the content expansion after v0.2.0. It keeps the core object model stable while adding stronger guidance for how real Agent products test user-facing and runtime surfaces.

## v0.2.0

Agent QC v0.2.0 corrects the scope of the standard and moves from product-specific draft to portable Agent-project QC protocol.

### Highlights

- Generalizes Agent QC across Agent project types: runtime CLIs, SDKs, tool/MCP gateways, multi-channel gateways, UI/TUI/desktop clients, skills/plugins, background schedulers, distributions, and eval suites.
- Adds project classification before gate selection, so an implementor can combine profiles instead of inheriting product-specific rules.
- Adds a generic gate taxonomy: static hygiene, unit/property, contract/protocol, fake integration, local runtime E2E, UI interaction, live provider, distribution smoke, stress/concurrency, and semantic eval gates.
- Keeps qcloop as a batch QC loop for repeated independent cases, while making its item/verifier contract project-agnostic.
- Adds case-study patterns from representative runtime, gateway, scheduler, UI, release, and eval systems.

### Scope

This draft is intended to become a general Agent QC standard. Product-specific examples are separate from the core protocol.

## v0.1.0

Agent QC v0.1.0 was the first product-focused draft standard for evidence-driven testing plans, quality gates, qcloop batches, verdicts, and release-ready reports. It is superseded by v0.2.0's general standard direction.
