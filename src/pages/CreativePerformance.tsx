import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

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
  const { toast } = (useToast as any)();
  const weights = [
    { name: "V1", value: 50 },
    { name: "V2", value: 20 },
    { name: "V3", value: 30 },
  ];
  const pieColors = ["#4f46e5", "#06b6d4", "#16a34a"];
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
                  <Button size="sm" variant="secondary" onClick={() => toast({ title: "Refresh queued", description: `${it.platform} · ${it.id}` })}>Refresh variants</Button>
                  <Button size="sm" variant="outline" onClick={() => toast({ title: "Headline swap queued", description: `${it.platform} · ${it.id}` })}>Swap headline</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Multi-arm bandit share</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <PieChart>
                  <Pie data={weights} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {weights.map((_, i) => (
                      <Cell key={i} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Top creatives by ROAS</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                {items
                  .slice()
                  .sort((a, b) => b.roas - a.roas)
                  .map((i) => (
                    <li key={i.id} className="flex items-center justify-between">
                      <span className="text-muted-foreground">{i.platform} · {i.id}</span>
                      <span className="font-medium">{i.roas.toFixed(1)}x</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default CreativePerformance;


