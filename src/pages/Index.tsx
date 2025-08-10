import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const views = [
  { id: 6, title: "Live Ops Console", path: "/live-ops", persona: "Performance Marketing" },
  { id: 1, title: "Executive Overview", path: "#", persona: "CMO / Leadership" },
  { id: 3, title: "SKU Performance Drilldown", path: "#", persona: "Brand Manager" },
  { id: 9, title: "Creative Performance & Fatigue", path: "#", persona: "Creative / Content" },
  { id: 11, title: "Availability & OOS Watchtower", path: "#", persona: "Supply Chain" },
  { id: 5, title: "Promotions & Pricing Efficacy", path: "#", persona: "Brand Manager" },
  { id: 2, title: "Strategic Heatmaps & Trends", path: "#", persona: "CMO / Leadership" },
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
