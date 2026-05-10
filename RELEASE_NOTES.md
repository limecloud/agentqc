# Release Notes

## v0.2.0

Agent QC v0.2.0 corrects the scope of the standard. Lime is now a case study and profile, not the center of the standard.

### Highlights

- Generalizes Agent QC across Agent project types: runtime CLIs, SDKs, tool/MCP gateways, multi-channel gateways, UI/TUI/desktop clients, skills/plugins, background schedulers, distributions, and eval suites.
- Adds project classification before gate selection, so an implementor can combine profiles instead of inheriting Lime-specific rules.
- Adds a generic gate taxonomy: static hygiene, unit/property, contract/protocol, fake integration, local runtime E2E, UI interaction, live provider, distribution smoke, stress/concurrency, and semantic eval gates.
- Keeps qcloop as a batch QC loop for repeated independent cases, while making its item/verifier contract project-agnostic.
- Adds case-study patterns from Codex, OpenClaw, Hermes Agent, and Lime.

### Scope

This draft is intended to become a general Agent QC standard. Lime remains an example profile that demonstrates GUI desktop quality gates.

## v0.1.0

Agent QC v0.1.0 was the first Lime-focused draft standard for evidence-driven testing plans, quality gates, qcloop batches, verdicts, and release-ready reports. It is superseded by v0.2.0's general standard direction.
