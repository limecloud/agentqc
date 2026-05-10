---
title: Glossary
description: Terms used by Agent QC.
---

# Glossary

| Term | Meaning |
| --- | --- |
| Gate | A required validation boundary for a change type. |
| Evidence | Inspectable record that supports or disproves a verdict. |
| Verdict | A pass/fail/blocked/exhausted judgment over evidence. |
| qcloop | Batch execution tool for worker/verifier/repair loops. |
| Attempt | qcloop worker or repair execution for one item. |
| QC round | qcloop verifier execution for one item. |
| Exhausted | A loop used all allowed rounds or budget without proving a pass. |
| GUI smoke | Minimal test that proves Lime GUI shell, bridge, and workspace readiness. |
| Contract test | Test that catches drift between frontend command calls, Rust handlers, catalogs, and mocks. |
| Remaining risk | What the current evidence does not prove. |
