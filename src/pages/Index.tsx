import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const views = [
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

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Synapse Dashboard – ITC Performance Marketing</title>
        <meta name="description" content="AI-powered & agentic performance marketing dashboard for ITC Foods with role-based views and global filters." />
        <link rel="canonical" href="/" />
      </Helmet>
      <DashboardLayout title="AI-Powered Performance Marketing" subtitle="Choose a view to begin.">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {views.map((v) => (
            <Card key={v.id} className="transition hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{v.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground flex items-center justify-between">
                <span>{v.persona}</span>
                {v.path === "#" ? (
                  <span className="rounded-md bg-muted px-2 py-1">Coming soon</span>
                ) : (
                  <Link to={v.path} className="rounded-md bg-secondary px-2 py-1">Open</Link>
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      </DashboardLayout>
    </>
  );
};

export default Index;
