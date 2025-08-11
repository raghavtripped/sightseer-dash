Experiments / A/B & Holdouts – Acceptance Criteria

Purpose
- Design, run, and read clean incrementality tests, plus persistent holdouts per SKU/platform.

Layout
- Header: Filters + Create test CTA.
- Sections: Running | Upcoming | Archive. Right drawer for test detail & decisions.

Running Tests
- Columns: ID | Name | Type | Platform | Primary KPI | Guardrail KPIs | Lift % | p-value | Power % | Progress | Status.
- Calculations: Lift % = (KPI_var – KPI_ctrl) / KPI_ctrl; Power % recomputed daily (α=0.05); show MDE helper.
- Stop rules: win (p≤0.05, power≥80%, guardrails green); harm (KPI worse by ≥X% with p≤0.1 for 24h); futility (power≥90% and |lift|<MDE).

Test Detail Drawer
- Design, Assignment health, Live diff charts, Decisions, Links to campaigns/tickets.

Create Test Wizard (5 steps)
1) Objective; 2) Scope; 3) Variants; 4) Stats plan; 5) Guardrails & fail-safes. Create draft or Launch now.

Holdouts
- SKU/platform holdout config by city/daypart (% traffic held out). Dashboard with incremental sales estimate vs baseline, confidence.

Archive & Learnings
- Cards with outcome, insight, re-use tags; searchable; export PDF.

Interactions
- Promote winner to Live Ops; Calendar for Upcoming; conflict warnings on overlap.

States & Errors
- Insufficient power; Interference with Live Ops; Data latency banner.

Permissions
- Create/launch: Perf or Brand Manager; Budget impact >₹X needs Approver. Declare winner & rollout: Perf Lead or Brand Lead.

