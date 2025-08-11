Alerts & Action Log (with Overrides) – Acceptance Criteria

Purpose
- One place for proactive issues + a tamper-proof audit trail of AI & human changes.

Layout
- Header: Filters + Severity chips (All, High, Med, Low), State chips (Open, Auto-resolved, Snoozed, Closed).
- Two tabs: Alerts | Action Log. Right drawer for details/override.

Alerts Tab
- Stream columns: Time | Severity | Type | Title | Affected entity | Auto-action | Owner | State.
- Detail drawer: What we detected, Evidence, Impact scope, Auto-action taken, Next best actions, Snooze, Assign owner, Add note, Mark closed.
- System rules: inline human-readable rules for OOS, Fatigue, High CPA.

Action Log Tab
- Columns: Time | Agent | Action | Entity | Params (before → after) | Outcome Δ | Ref | User.
- Interactions: Click for diff view; Undo where safe; Export CSV; Filter by agent/type/user/time.

Overrides (global)
- Approve queued AI changes; Explore/Exploit slider (ε=0.05/0.1/0.2); Temporary caps/floors; Visibility floor.

States
- Deduping of burst alerts; Routing of high severity; Mute noisy alerts for N days.

Permissions
- Create/edit rules: Admin. Close high-severity: Perf Lead/Owner. Override AI: Perf Lead; logged to Action Log.

