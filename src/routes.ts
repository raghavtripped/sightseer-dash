export type PersonaKey =
  | "CMO / Leadership"
  | "Brand / Category Manager"
  | "Performance Marketing"
  | "Creative / Content"
  | "Supply Chain / Channel Ops"
  | "Finance / FP&A"
  | "Data / IT Admin";

export interface AppRouteDef {
  id: number;
  title: string;
  path: string;
  persona: PersonaKey;
}

export const appRoutes: AppRouteDef[] = [
  { id: 6, title: "Live Ops Console", path: "/live-ops", persona: "Performance Marketing" },

  { id: 1, title: "Executive Overview", path: "/executive-overview", persona: "CMO / Leadership" },
  { id: 2, title: "Strategic Heatmaps & Trends", path: "/strategic-heatmaps", persona: "CMO / Leadership" },

  { id: 3, title: "SKU Performance Drilldown", path: "/sku-performance", persona: "Brand / Category Manager" },
  { id: 4, title: "Daypart × Region Planner", path: "/daypart-region-planner", persona: "Brand / Category Manager" },
  { id: 5, title: "Promotions & Pricing Efficacy", path: "/promotions-pricing", persona: "Brand / Category Manager" },

  { id: 7, title: "Alerts & Action Log", path: "/alerts-action-log", persona: "Performance Marketing" },
  { id: 8, title: "Experiments / A/B & Holdouts", path: "/experiments", persona: "Performance Marketing" },

  { id: 9, title: "Creative Performance & Fatigue", path: "/creative-performance", persona: "Creative / Content" },
  { id: 10, title: "Listing Content QA & Readiness", path: "/listing-qa", persona: "Creative / Content" },

  { id: 11, title: "Availability & OOS Watchtower", path: "/availability-watchtower", persona: "Supply Chain / Channel Ops" },
  { id: 12, title: "Forecast & Coverage", path: "/forecast-coverage", persona: "Supply Chain / Channel Ops" },

  { id: 13, title: "Budget, Spend & ROI Ledger", path: "/finance-ledger", persona: "Finance / FP&A" },

  { id: 14, title: "Integrations & System Health", path: "/integrations-health", persona: "Data / IT Admin" },
];

export const routesByPersona: Record<PersonaKey, AppRouteDef[]> = appRoutes.reduce((acc, r) => {
  (acc[r.persona] ||= []).push(r);
  return acc;
}, {} as Record<PersonaKey, AppRouteDef[]>);


