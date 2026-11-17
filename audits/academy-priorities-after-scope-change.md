# Academy development priorities — scope decision

## User learning goals

- **Flight Academy:** broad personal understanding of how aircraft fly, the main aircraft systems, instrumentation, weather, navigation and aviation decision-making. The current three levels are retained for optional deeper reading; no further professional-pilot or engineering-depth expansion is required by default.
- **Space Mission Control Academy:** broad personal understanding of rockets, satellites, orbits, spacecraft systems and mission control. Existing Levels 1–3 remain accessible, including advanced optional material. No additional professional aerospace-engineering-depth development by default.
- **Survival & Doomsday Prep Academy:** primary active curriculum-development priority. Continue in-depth, realistic, usable preparedness lessons, particularly safe water, food and sanitation; 30/90/180-day resilience; medical continuity and professional-care access; land navigation and evacuation; communication and household power systems.

## Implementation rules

1. Do not delete or shorten current Flight or Space lessons or alter their three-level structure.
2. Keep existing simulator functionality, lesson styling, Reading and Questions tabs, and progress behavior.
3. Prioritize Survival teaching depth and practical guided casework rather than adding new exam quantity.
4. Present staged scenarios as contingencies, not predictions of collapse, and include official guidance, resource dependency analysis, medical/electrical safety boundaries and recovery options.
5. Keep changes on `curriculum/depth-levels-1-3-v2` until the user explicitly approves a production merge.
6. A structural code check is not a complete live-browser, device, or academic-content signoff.

## Initial implementation

Six Survival Level 2 practical scenario sections were added, one in each of the six existing modules: safe land-navigation route design, medical continuity, ninety-day replenishment, usable-water accounting, shelter/evacuation assessment and maintainable household-resource ledgers. Flight and Space textbook content was preserved.
