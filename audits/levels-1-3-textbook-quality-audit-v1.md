# Internal curriculum quality audit — Levels 1–3

> Scope: the three academy textbook datasets on branch `curriculum/depth-levels-1-3-v2`. This is a structural/content consistency check, **not independent academic, medical, aviation or spaceflight verification**.

## Coverage and structural checks

| Academy | Units | L1 | L2 | L3 | Minimum words in a unit (excluding some supplementary fields) |
|---|---:|---:|---:|---:|---:|
| flight | 18 | 6 | 6 | 6 | 620 |
| survival | 18 | 6 | 6 | 6 | 640 |
| space | 18 | 6 | 6 | 6 | 554 |

## Completed in this pass

- Added 26 original case-oriented instructional sections to 13 relatively short Level 1–2 units.
- Inspected all 54 textbook unit records and checked that section entries have a three-string `[heading, paragraph1, paragraph2]` structure.
- Removed 72 exact duplicate Level 3 sections previously presented in earlier levels within the same category; retained the lower-level source text and unique advanced examples.
- Preserved the separate Questions interface and existing local progress and simulator references.

## Issues that remain

- Chapter length and prose depth are uneven; short units remain and require deeper expansion rather than inflated section counts.
- Many examples use fictional or simplified assumptions; actual calculations should be independently verified against authoritative aviation, medical/public-health and aerospace references where relevant.
- Textbook content lacks a comprehensive, linked scholarly bibliography, source provenance, and independent subject-matter review.
- Automated syntax and data checks do not establish the quality of explanations, the correctness of scientific models, or complete educational equivalence.
- Browser interaction, mobile performance, question tab behavior, persistence and simulator flows still need physical-device acceptance tests.

## Next content priorities

1. Expand the shortest remaining Space Level 1–2 chapters with sourced fundamentals, derivations and contextual research.
2. Expand the shortest Survival medical, water, sanitation and energy chapters while maintaining clear safety and clinical boundaries.
3. Expand Flight navigation, safety and landing chapters with validated source references and explicit model limitations.
4. Produce a bibliography and an independent-review checklist before claiming academic sign-off.

## Change control

Branch only; no production merge. Existing six categories, grades, saved progress and simulators are not intentionally changed.

## Subsequent audit update — source coverage and curriculum consistency (2026-11-17)

- **54 of 54 textbook units** (18 per academy, six per level) now have at least one linked authoritative background reference; the dataset contains 15 distinct reference URLs.
- The final ten unreferenced units received ten additional context-specific instructional sections, not merely a generic link.
- Script syntax, section triplets, optional question structure and link-field syntax pass programmatic checks.
- No exact duplicate section bodies remain across each academy dataset.
- The HTML asset references for all three academies were increased to textbook data version 20; the existing Questions tab and simulator/specialist script references remain in place.

**Important limits:** Source linkage is not the same as claim-by-claim source verification. Some references cover broad foundational concepts, not every statement or worked example in a chapter. Every chapter still needs claim-level evidence checking, professional review of safety-sensitive passages, instructional quality review, and live browser/device acceptance tests before academic sign-off. Production `main` was not changed by these development commits.
