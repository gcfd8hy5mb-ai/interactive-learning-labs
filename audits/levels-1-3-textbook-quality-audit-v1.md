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


## Claim-level review sample — 2026-11-17

This section documents a **targeted review**, not an audit of every assertion in the 54 units. Each record distinguishes a directly supported principle, an independently checked example calculation, and a conclusion still needing expert validation.

| Academy / textbook location | Reviewed claim | Evidence and result | Disposition |
|---|---|---|---|
| Survival L1 / Food, water and sanitation | Boil-water, do-not-drink and do-not-use advisories mean different things | CDC Drinking Water Advisories overview lists all three categories and distinguishes contact risks | **Reworded** to specify the distinctions and connected-appliance caution |
| Survival L1 / Medical continuity | Individual prescriptions, assistive devices and supplies belong in emergency planning | CDC Personal Needs enumerates these dependencies | **Supported as background**; individual clinical advice still necessary |
| Survival L3 / Land navigation | 3° bearing error across 2 km ≈105 m lateral offset | Direct trigonometric check: 2,000 × sin(3°) = 104.7 m | **Arithmetic supported**; excludes datum and field errors |
| Flight L3 / Aerodynamics | Speed reduction from 60 to 48 m/s gives 0.64 of speed-squared lift term if other inputs held fixed | (48/60)²=0.64; required coefficient multiplier 1/0.64=1.5625 | **Arithmetic supported**; FAA fundamentals supply context, not aircraft performance certification |
| Flight L2 / Navigation | 60 NM legs at 90, 110, 80 knots take ≈1.97 h total | 60/90+60/110+60/80=1.9621 h, approximately 1.96 h; the prior prose saying 1.97 h is a rounding discrepancy | **Flagged for correction** |
| Flight L3 / Landing | 1,800 m runway with touchdowns at 300 m and 1,050 m leaves 1,500 m and 750 m | Direct subtraction from the illustrative runway length | **Arithmetic supported**; does not validate stopping performance |
| Space L1 / Mission architecture | A 4 Mb/s link for 12 min transmits at most 360 decimal MB before overhead | 4×720÷8=360 MB, explicitly assuming decimal units and uninterrupted nominal throughput | **Reworded** to distinguish example assumptions from NASA statements |
| Space L2 / Orbital mechanics | For μ=400,000 km³/s², r=8,000 km, circular speed √50≈7.071 km/s; with a=10,000 km, vis-viva speed √60≈7.746 km/s | Algebra checked; NASA Gravity & Mechanics is conceptual background, Physics LibreTexts Vis Viva chapter covers the explicit formula | **Tightened equation-specific reference** |
| Space / Systems engineering | Verification differs from validation | NASA Systems Engineering Handbook/appendix discusses separate verification and validation activities | **Supported as background**, not a source for fictional spacecraft numbers |

**Reviewed sources:** [CDC drinking water advisories](https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html), [CDC personal needs](https://www.cdc.gov/prepare-your-health/take-action/personal-needs.html), [FAA Pilot's Handbook](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak), [USGS topographic maps](https://www.usgs.gov/programs/national-geospatial-program/topographic-maps), [NASA systems engineering handbook](https://www.nasa.gov/reference/systems-engineering-handbook/), [NASA Gravity and Mechanics](https://science.nasa.gov/learn/basics-of-space-flight/chapter3-3/), and [Physics LibreTexts vis-viva equation](https://phys.libretexts.org/Courses/Prince_Georges_Community_College/General_Physics_I%3A_Classical_Mechanics/57%3A__Celestial_Mechanics/57.10%3A_The_Vis_Viva_Equation).

**Limitations:** This does not verify every calculation, external URL, regulation, safety instruction, or scientific statement. Publication quality, source relevance and accessible formatting require additional subject-matter review. No iPhone or live-browser acceptance test was performed.


## Targeted assumption and source audit — continuation (2026-11-17)

This is a second **bounded review**, not completion of the full academic accuracy audit. Four instructional sections were revised to distinguish their measured quantities, modeling assumptions and real-world limitations.

| Course / section | Mathematical or evidence check | Revision / result |
|---|---|---|
| Survival L2 / Error propagation across legs | For **travel distance** 1,000 m, lateral error at 5° is 1,000 sin(5°)=87.16 m. If 1,000 m is instead forward **projected distance**, lateral error is 1,000 tan(5°)=87.49 m. | Explicitly distinguished the two geometric assumptions. Both figures are rounded and exclude mapping, bearing and terrain uncertainties. |
| Flight L1 / A model of lift and its limits | ½ × 1.2 × 40² × 16 × 0.5 = 7,680 N; at 30 m/s the result is 4,320 N under fixed inputs, a 56.25% ratio. | Explicitly distinguished air-relative speed from groundspeed, and stated that CL is artificially held constant. Background authority: FAA Pilot's Handbook. |
| Space L1 / A bottleneck that changes the entire mission | 4 **megabits**/s for 480 s = 1,920 megabits = 240 decimal **megabytes**; 300 MB produced minus 240 MB maximum = 60 MB minimum remaining. | Documented decimal prefixes, theoretical uninterrupted throughput, protocol overhead and scientific data-quality constraints. The numerical case is fictional. |
| Space L1 / Dynamic pressure is not monotonic | ½ × 0.6 × 250² = 18,750 Pa; ½ × 0.3 × 300² = 13,500 Pa. | Retained the numerical result and clarified it is a simplified model, not a vehicle structural-load certificate. |

### External source spot checks

- [CDC Drinking Water Advisories](https://www.cdc.gov/water-emergency/about/drinking-water-advisories-an-overview.html): current page explicitly distinguishes boil-water, do-not-drink and do-not-use notices; the preceding water-advisory wording is consistent with this classification.
- [FAA Pilot's Handbook of Aeronautical Knowledge](https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak): official handbook landing page is accessible as background for flight forces and performance terminology.
- [NASA Basics of Space Flight — Gravity and Mechanics](https://science.nasa.gov/learn/basics-of-space-flight/chapter3-3/): official NASA resource is accessible for foundational gravity and mechanics.
- [NASA Systems Engineering Handbook](https://www.nasa.gov/reference/systems-engineering-handbook/): official handbook page is accessible as a systems-engineering reference.

**Audit interpretation:** URL accessibility and source-topic relevance are not claim-by-claim proof. These four changes address model clarity and mathematical reasoning; the full 54-unit textbook still requires comprehensive reference-level review, expert subject review, and running-browser / mobile acceptance tests. No independent academic sign-off is claimed.
