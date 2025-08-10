import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Creative = {
  id: string;
  platform: string;
  ctr: number;
  cvr: number;
  roas: number;
  imprToFatigue: number;
  lastRefreshed: string;
};

const items: Creative[] = [
  { id: "V1", platform: "Blinkit", ctr: 1.2, cvr: 2.8, roas: 5.9, imprToFatigue: 120000, lastRefreshed: "3d" },
  { id: "V2", platform: "Zepto", ctr: 0.9, cvr: 2.1, roas: 4.2, imprToFatigue: 60000, lastRefreshed: "6d" },
  { id: "V3", platform: "Instamart", ctr: 1.5, cvr: 3.0, roas: 6.1, imprToFatigue: 180000, lastRefreshed: "1d" },
];

const CreativePerformance: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Creative Performance & Fatigue – Synapse</title>
        <meta name="description" content="Understand which assets drive performance and which need refresh." />
        <link rel="canonical" href="/creative-performance" />
      </Helmet>
      <DashboardLayout title="Creative Performance & Fatigue" subtitle="Which assets print money; which are tired?">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.id} className="overflow-hidden">
              <div className="h-32 bg-muted flex items-center justify-center">
                <img src="/placeholder.svg" alt="thumb" className="h-20" />
              </div>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm">{it.platform} · {it.id}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1">
                <div>CTR {it.ctr}% · CVR {it.cvr}% · ROAS {it.roas.toFixed(1)}x</div>
                <div>Impr to fatigue est. {it.imprToFatigue.toLocaleString()}</div>
                <div>Last refreshed {it.lastRefreshed} ago</div>
                <div className="pt-2 flex gap-2">
                  <Button size="sm" variant="secondary">Refresh variants</Button>
                  <Button size="sm" variant="outline">Swap headline</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Multi-arm bandit share</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Placeholder distribution of serving weights by creative.
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default CreativePerformance;


