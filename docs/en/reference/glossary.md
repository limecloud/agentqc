---
title: Glossary
description: Terms used by Agent QC.
---

# Glossary

| Term | Meaning |
| --- | --- |
| Project profile | Agent project shape that determines likely risks and gates. |
| Gate | Required validation boundary for a profile or change risk. |
| Evidence | Inspectable record that supports or disproves a verdict. |
| Verdict | Evidence-backed passed/failed/blocked/exhausted/waived/needs-review judgment. |
| qcloop | Batch execution loop for worker/verifier/repair tasks. |
| Attempt | qcloop worker or repair execution for one item. |
| QC round | qcloop verifier execution for one item. |
| Exhausted | Attempts or budget ended without proof. |
| Waiver | Explicit accepted gap with reason, owner, and expiry. |
| Live provider | Real external model, API, channel, or network dependency. |
| Semantic eval | Test that judges model/task output against a rubric or baseline. |
| Remaining risk | What current evidence still does not prove. |
