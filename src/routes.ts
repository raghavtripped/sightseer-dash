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
  { id: 6, title: "Live ops console", path: "/live-ops", persona: "Performance Marketing" },

  { id: 1, title: "Executive overview", path: "/executive-overview", persona: "CMO / Leadership" },
  { id: 2, title: "Strategic heatmaps & trends", path: "/strategic-heatmaps", persona: "CMO / Leadership" },

  { id: 3, title: "SKU performance drilldown", path: "/sku-performance", persona: "Brand / Category Manager" },
  { id: 4, title: "Daypart × region planner", path: "/daypart-region-planner", persona: "Brand / Category Manager" },
  { id: 5, title: "Promotions & pricing efficacy", path: "/promotions-pricing", persona: "Brand / Category Manager" },

  { id: 7, title: "Alerts & action log", path: "/alerts-action-log", persona: "Performance Marketing" },
  { id: 8, title: "Experiments (A/B & holdouts)", path: "/experiments", persona: "Performance Marketing" },

  { id: 9, title: "Creative performance & fatigue", path: "/creative-performance", persona: "Creative / Content" },
  { id: 10, title: "Listing content QA & readiness", path: "/listing-qa", persona: "Creative / Content" },

  { id: 11, title: "Availability & OOS watchtower", path: "/availability-watchtower", persona: "Supply Chain / Channel Ops" },
  { id: 12, title: "Forecast & coverage", path: "/forecast-coverage", persona: "Supply Chain / Channel Ops" },

  { id: 13, title: "Budget, spend & ROI ledger", path: "/finance-ledger", persona: "Finance / FP&A" },

  { id: 14, title: "Integrations & system health", path: "/integrations-health", persona: "Data / IT Admin" },
];

export const routesByPersona: Record<PersonaKey, AppRouteDef[]> = appRoutes.reduce((acc, r) => {
  (acc[r.persona] ||= []).push(r);
  return acc;
}, {} as Record<PersonaKey, AppRouteDef[]>);


