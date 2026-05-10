---
title: Evidence-driven verdicts
description: How Agent QC decides pass, fail, blocked, exhausted, waived, and needs-review.
---

# Evidence-driven verdicts

A verdict is a claim about observed evidence. The model's final prose is not enough.

## Verdict statuses

| Status | Meaning |
| --- | --- |
| `passed` | Evidence proves all required expectations. |
| `failed` | Evidence disproves an expectation or a gate exits non-zero. |
| `blocked` | Environment, credentials, dependency, or missing fixture prevents judgment. |
| `exhausted` | Attempts or budget were consumed without proof. |
| `waived` | A responsible actor accepted a known gap with a reason and expiry. |
| `needs-review` | Evidence exists but semantic or safety review is still required. |

## Good evidence

Good evidence is inspectable and scoped:

- command log or CI job URL;
- JUnit/HTML/coverage report;
- protocol transcript or mock server request log;
- Playwright trace, screenshot, or video;
- qcloop attempt and qc round refs;
- package manifest, tarball listing, Docker smoke output;
- model output plus rubric and judge verdict;
- human review note with reviewer and scope.

## Bad evidence

Bad evidence is unverifiable:

- "looks good";
- "the tests passed" without a command or CI ref;
- hidden local state with no path or transcript;
- live provider claim with no redacted request/response or budget note.
