Home (Dashboard Landing) – Acceptance Criteria

Purpose
- Pick a view fast, see what changed today at a glance, and jump to live issues.

Layout
- Header: Title, Global Filters, Metric definitions.
- KPI strip (Today vs Yesterday): Conversions, Spend, ROAS, CPA, NTB%.
- Quick panels (3 columns):
  1. Persona tiles (all 14 views) with 1-line purpose + Open CTA; small stat: items needing attention.
  2. Top alerts (last 24h) by severity; clicking opens Alerts & Action Log → alert detail drawer.
  3. Saved views & recent activity (last 10 actions, who did what).
- Footer: Data freshness timestamp; API health (green/amber/red).

Global Filters (sticky across app)
- Date range, Platforms (multi), Cities (multi), Brand (single), SKUs (multi), Dayparts.
- Reset restores: Last 7 days, all platforms, top 5 cities, selected brand, all SKUs, all dayparts.

Components & Fields
- KPI cards (calc):
  - Conversions = Σ orders.
  - Spend = Σ ad_spend.
  - ROAS = Σ revenue_attributed / Σ ad_spend.
  - CPA = Σ ad_spend / Σ orders.
  - NTB% = NTB_orders / orders.
- Top alerts list: { severity, title, affected_entity, time, auto_action_taken }.
- Persona tiles: name, 1-line purpose, Open CTA, items_needing_attention.

Interactions
- Switching persona opens in same tab; ctrl/cmd-click opens new tab.
- Clicking an alert opens Alerts & Action Log with alert detail drawer open.
- Create saved view stores current filter set + landing layout.

States
- Empty: “No data for filters. Try expanding date range.”
- Loading: skeleton cards; freshness clock pauses.
- Error: red banner with retry; log ref ID.

Guardrails
- Role: any authenticated user; KPI strip visible to all.
- Sensitive spend numbers respect role-based masking (Finance sees full; others see indexed).

Shared Bits
- Metric tooltips: ROAS, CPA, Pacing %, NTB% as specified.
- Color rules: Green ≥ target; Amber within 10%; Red otherwise. Targets configurable per platform/city/daypart.
- Time zone: Asia/Kolkata; daypart boundaries = 06:00, 12:00, 16:00, 19:00.
- Auto-refresh: 60s default; backoff to 120/300s on rate-limit.
- Auditability: Every change → Action Log with before/after and actor.

