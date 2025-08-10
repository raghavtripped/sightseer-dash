import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";

const dayparts = ["Breakfast", "Lunch", "Snacks", "Dinner"] as const;
const platforms = ["Blinkit", "Zepto", "Instamart", "Amazon", "Flipkart"] as const;

const roasMatrix: Record<string, Record<string, number>> = {
  Blinkit: { Breakfast: 5.2, Lunch: 4.8, Snacks: 6.1, Dinner: 5.7 },
  Zepto: { Breakfast: 4.4, Lunch: 4.0, Snacks: 4.9, Dinner: 5.1 },
  Instamart: { Breakfast: 3.8, Lunch: 4.1, Snacks: 4.3, Dinner: 4.0 },
  Amazon: { Breakfast: 3.5, Lunch: 3.7, Snacks: 3.9, Dinner: 3.6 },
  Flipkart: { Breakfast: 3.9, Lunch: 4.2, Snacks: 4.0, Dinner: 3.8 },
};

const StrategicHeatmaps: React.FC = () => {
  const { toast } = (useToast as any)();
  const weeks = Array.from({ length: 8 }).map((_, i) => `W${i + 1}`);
  const series = weeks.map((w, i) => ({ week: w, roas: 3.5 + (i * 0.2) + (i % 3 === 0 ? 0.3 : -0.1), cpa: 160 - i * 3 }));

  const recommend = () => {
    toast({ title: "Reallocation ready", description: "+₹20k → Blinkit Snacks Delhi; -₹15k ← Amazon Breakfast; +₹10k → Zepto Dinner Mumbai" });
  };
  return (
    <>
      <Helmet>
        <title>Strategic Heatmaps & Trends – Synapse</title>
        <meta name="description" content="Heatmaps and trends to guide budget allocation by platform and daypart with geo insights." />
        <link rel="canonical" href="/strategic-heatmaps" />
      </Helmet>
      <DashboardLayout title="Strategic Heatmaps & Trends" subtitle="Where to push/pull budgets next?">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">ROAS heatmap: Platform × Daypart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2"></th>
                      {dayparts.map((d) => (
                        <th key={d} className="text-left p-2">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {platforms.map((p) => (
                      <tr key={p}>
                        <td className="p-2 font-medium">{p}</td>
                        {dayparts.map((d) => {
                          const v = roasMatrix[p][d];
                          const tone = v >= 5 ? "bg-green-500/20" : v >= 4 ? "bg-amber-500/20" : "bg-red-500/20";
                          return (
                            <td key={d} className={`p-2 ${tone} text-center rounded-md`}>{v.toFixed(1)}x</td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Trend lines: 8-week ROAS & CPA</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ roas: { label: "ROAS", color: "hsl(var(--primary))" }, cpa: { label: "CPA", color: "hsl(var(--muted-foreground))" } }}
                className="h-64"
              >
                <LineChart data={series}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="roas" stroke="var(--color-roas)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cpa" stroke="var(--color-cpa)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Geo ROAS and NTB% by city (map)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Map placeholder. Integrate your map provider or a choropleth.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Insights</CardTitle>
              <Button size="sm" onClick={recommend}>Recommend reallocation</Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <div className="font-medium">Top 3 hot spots</div>
                <ul className="list-disc ml-5 text-muted-foreground">
                  <li>Blinkit Snacks in Delhi (6.1x)</li>
                  <li>Zepto Dinner in Mumbai (5.1x)</li>
                  <li>Instamart Lunch in BLR (4.1x)</li>
                </ul>
              </div>
              <div>
                <div className="font-medium">3 leak zones</div>
                <ul className="list-disc ml-5 text-muted-foreground">
                  <li>Amazon Breakfast (3.5x)</li>
                  <li>Flipkart Dinner (3.8x)</li>
                  <li>Instamart Snacks in Pune (3.9x)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default StrategicHeatmaps;


