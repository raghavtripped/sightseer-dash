Live Ops Console – Acceptance Criteria

Purpose
- Monitor pacing & performance right now, take bulk & inline actions, and see impact forecasts before committing.

Layout
- Header: Page title, Global Filters, Mode badge (AI Majority / Manual / Mixed).
- Today vs Yesterday strip: Conversions (Δ), Budget burn (Spend today / Plan), ROAS today, CPA today, Impr today.
- Controls row: Search, Column picker, Group by (Platform/City/Daypart/Brand), Auto-refresh toggle (60s default), Export PNG/CSV, One-click deck.
- Main table (virtualized, sticky header) + Right details drawer (opens on row click).

Table Columns
- Campaign, Platform, Status, Spend today, Pacing %, Impr, Clicks, Conv, ROAS, CPA, Budget left, Mode, Issues.
- Pacing % formula: Budget pacing = spend_today / daily_plan * 100.
- Time-aligned pacing (tooltip): spend_today / (daily_plan * elapsed_seconds_today / total_seconds_in_day) * 100.
- Colors: Green 90–110%; Amber 75–90 / 110–125%; Red <75 or >125.

Row Actions
- Pause / Resume; Bid −5% / +5% / custom %; Shift budget (mini-wizard); Switch creative; Toggle Mode; Open details.

Details Drawer
- Mini KPIs (today / last 7d), Sparklines (hourly), Targeting, Creatives in rotation, Guardrails active, Forecast card.

Bulk Actions
- Multi-select Pause/Resume, Bid adjust, Budget shift, Change Mode with aggregate forecast + confirmation.

Interactions
- Group by adds subtotal rows; Column picker persists; Auto-refresh soft-merges updates.

States
- OOS-hold: Limited status + Issues=OOS; API lag: grey dot with tooltip; No campaigns CTA to Plan.

Permissions
- Default: read + suggest; Write for Performance; Budget shift >₹50k requires Approver or dual-confirm.

