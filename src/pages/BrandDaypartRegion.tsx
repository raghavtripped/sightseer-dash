import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Info from "@/components/Info";
import KPI from "@/components/KPI";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, AreaChart, Area, Tooltip as RTooltip } from "recharts";

const cities = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Hyderabad"];
const dayparts = ["Breakfast", "Lunch", "Snacks", "Dinner"];

type Matrix = Record<string, Record<string, number>>

const initMatrix: Matrix = cities.reduce((acc, c) => {
  const inner = dayparts.reduce((m, d) => ({ ...m, [d]: 50 }), {} as Record<string, number>)
  acc[c] = inner
  return acc
}, {} as Matrix)

const BrandDaypartRegion: React.FC = () => {
  const { toast } = (useToast as any)();
  const [matrix, setMatrix] = React.useState<Matrix>(initMatrix)
  const cityTotal = (c: string) => Object.values(matrix[c]).reduce((a, b) => a + b, 0)
  const overall = cities.reduce((sum, c) => sum + cityTotal(c), 0)
  return (
    <>
      <Helmet>
        <title>Daypart × Region Planner – Synapse</title>
        <meta name="description" content="Plan budgets by city and daypart with availability matrix and guardrails." />
        <link rel="canonical" href="/daypart-region-planner" />
      </Helmet>
      <DashboardLayout title="Daypart × Region Planner" subtitle="Right product, right moment, right city.">
        {/* Row 1: Objective & quick stats */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KPI label="Objective" value="Max Conversions" info={{ short: "What the optimizer maximizes (Conversions or ROAS)." }} />
          <KPI label="Visibility floor" value="≥15%" info={{ short: "Minimum impression share to maintain presence." }} />
          <KPI label="Platform cap" value="≤60%" info={{ short: "Max % of budget allowed on one platform." }} />
          <KPI label="OOS guard" value="Pause on 2 checks" info={{ short: "Auto-pause if availability hits 0 in a city." }} />
        </section>

        {/* Row 2: Heatmaps + Actions */}
        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Heatmaps</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-md border p-3 text-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>SKU × Daypart</span>
                  <Info short="Cell shows metric and Δ vs last 4w; hatched outline = significant change (p≤0.05)." />
                </div>
                <div className="mt-2 text-muted-foreground">Heatmap placeholder with seeded values.</div>
              </div>
              <div className="rounded-md border p-3 text-sm">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>City × SKU availability & shelf share</span>
                  <Info short="Two sub-cells: In-stock% and Shelf share%; red if OOS risk >10% or share <25%." />
                </div>
                <div className="mt-2 text-muted-foreground">Availability matrix placeholder.</div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-4">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Actions & Guardrails</CardTitle>
              <Button size="sm" onClick={() => toast({ title: "Plan generated", description: `₹${(overall * 1.2).toFixed(0)}k across ${cities.length} cities` })}>Generate next-week plan</Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>• Visibility floor ≥ 15%</div>
              <div>• Platform cap ≤ 60%</div>
              <div>• OOS: pause if availability = 0 for 2 checks</div>
              <div className="h-40">
                <ChartContainer config={{ c: { label: "Conv" } }} className="h-full">
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="spend" name="Spend" />
                    <YAxis type="number" dataKey="roas" name="ROAS" />
                    <ZAxis type="number" dataKey="conv" range={[60,240]} name="Conv" />
                    <RTooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Scatter data={[{ spend: 40, roas: 4.6, conv: 320 }, { spend: 25, roas: 5.2, conv: 220 }, { spend: 35, roas: 4.1, conv: 280 }]} fill="hsl(var(--primary))" />
                  </ScatterChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Row 3: Budget sliders + Forecast */}
        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget sliders per city/daypart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cities.map((c) => (
                <div key={c} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{c}</div>
                    <div className="text-xs text-muted-foreground">Total: ₹{(cityTotal(c) * 1.2).toFixed(0)}k</div>
                  </div>
                  {dayparts.map((d) => (
                    <div key={d} className="grid grid-cols-12 items-center gap-3">
                      <div className="col-span-3 text-xs text-muted-foreground">{d}</div>
                      <div className="col-span-7">
                        <Slider
                          value={[matrix[c][d]]}
                          max={100}
                          step={1}
                          onValueChange={([v]) => setMatrix((m) => ({ ...m, [c]: { ...m[c], [d]: v } }))}
                        />
                      </div>
                      <div className="col-span-2 text-right text-xs">₹{(matrix[c][d] * 1.2).toFixed(0)}k</div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="pt-2 text-right text-xs text-muted-foreground">Overall plan: ₹{(overall * 1.2).toFixed(0)}k</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">What‑if simulator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Total reallocation</div>
              <Slider value={[30]} max={100} step={5} />
              <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-md border p-2"><div className="text-xs text-muted-foreground">ΔConv</div><div className="font-medium">+90–130</div></div>
                <div className="rounded-md border p-2"><div className="text-xs text-muted-foreground">ΔSales</div><div className="font-medium">+₹3.1L</div></div>
                <div className="rounded-md border p-2"><div className="text-xs text-muted-foreground">ΔROAS</div><div className="font-medium">+0.3x</div></div>
              </div>
              <div className="mt-3 h-24">
                <ChartContainer config={{ s: { label: "Spend" } }} className="h-full">
                  <AreaChart data={[{ d: 1, s: 22 }, { d: 2, s: 28 }, { d: 3, s: 24 }, { d: 4, s: 30 }, { d: 5, s: 26 }, { d: 6, s: 32 }, { d: 7, s: 27 }] }>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="d" hide />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area dataKey="s" fill="hsl(var(--primary)/0.25)" stroke="hsl(var(--primary))" />
                  </AreaChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default BrandDaypartRegion;


