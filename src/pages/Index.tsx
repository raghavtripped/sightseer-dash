import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { routesByPersona, PersonaKey } from "@/routes";

const personas: PersonaKey[] = [
  "Performance Marketing",
  "CMO / Leadership",
  "Brand / Category Manager",
  "Creative / Content",
  "Supply Chain / Channel Ops",
  "Finance / FP&A",
  "Data / IT Admin",
];

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Synapse Dashboard – ITC Performance Marketing</title>
        <meta name="description" content="AI-powered & agentic performance marketing dashboard for ITC Foods with role-based views and global filters." />
        <link rel="canonical" href="/" />
      </Helmet>
      <DashboardLayout title="AI-Powered Performance Marketing" subtitle="Choose a view to begin." hideSidebar>
        <div className="space-y-8">
          {personas.map((persona) => (
            <PersonaSection key={persona} persona={persona} />
          ))}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Index;

const PersonaSection: React.FC<{ persona: PersonaKey }> = ({ persona }) => {
  const navigate = useNavigate();
  const routes = routesByPersona[persona] || [];
  return (
    <section className="space-y-3">
      <div className="text-sm font-semibold text-muted-foreground">{persona}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((v) => (
          <Card
            key={v.id}
            className="transition hover:shadow-md cursor-pointer"
            role="button"
            onClick={() => navigate(v.path)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{v.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground flex items-center justify-between">
              <span>{persona}</span>
              <span className="rounded-md bg-secondary px-2 py-1">Open</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
