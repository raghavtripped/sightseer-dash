import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, AreaChart, Area, ReferenceArea, ReferenceLine, Tooltip as RTooltip, BarChart, Bar } from "recharts";
import Info from "@/components/Info";
import KPI from "@/components/KPI";
import { useToast } from "@/hooks/use-toast";

const response = Array.from({ length: 6 }).map((_, i) => ({ spend: i * 10, blinkit: 20 + i * 8, zepto: 18 + i * 7 }))

const comp = [
  { city: "Delhi", ours: 100, rivalA: 98, rivalB: 102 },
  { city: "Mumbai", ours: 102, rivalA: 101, rivalB: 99 },
  { city: "Pune", ours: 99, rivalA: 96, rivalB: 101 },
]

const BrandPromotionsPricing: React.FC = () => {
  const { toast } = useToast();
  return (
    <>
      <Helmet>
        <title>Promotions & pricing efficacy — Synapse</title>
        <meta name="description" content="Measure promo uplift, elasticity, and comp pricing to drive decisions." />
        <link rel="canonical" href="/promotions-pricing" />
      </Helmet>
      <DashboardLayout title="Promotions & pricing efficacy" subtitle="Did the promo work? What next?">
        {/* KPI belt */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <KPI label="Incremental Sales" value="+₹12.5L" info={{ short: "Modeled extra revenue vs matched control during promo window (CUPED-adjusted).", long: "Incremental Sales: Modeled extra revenue vs matched control during promo window (CUPED-adjusted)." }} />
          <KPI label="Incremental Gross Margin" value="+₹7.1L" info={{ short: "Incremental sales × (1 − discount% − COGS%) minus ad spend.", long: "Incremental Gross Margin: Incremental sales × (1 − discount% − COGS%) minus ad spend." }} />
          <KPI label="Lift vs Control" value="+18.4%" info={{ short: "(Treatment − Control) ÷ Control over the window.", long: "Lift vs Control: (Treatment − Control) ÷ Control over the window." }} />
          <KPI label="Promo ROAS" value="5.2×" info={{ short: "Incremental sales ÷ promo ad spend (excludes baseline).", long: "Promo ROAS: Incremental sales ÷ promo ad spend (excludes baseline sales)." }} />
          <KPI label="Cannibalization" value="11%" info={{ short: "Share of uplift that replaced other SKUs/pack sizes.", long: "Cannibalization: Share of uplift that replaced other SKUs/pack sizes (estimated from category/brand shifts)." }} />
          <KPI label="Halo Sales" value="+₹2.3L" info={{ short: "Extra sales in adjacent SKUs/categories attributed to the promo.", long: "Halo Sales: Extra sales in adjacent SKUs/categories attributed to the promo." }} />
          <KPI label="Avg Discount Depth" value="9.5%" info={{ short: "Average % off during promo window.", long: "Avg Discount Depth: Average % off during promo window." }} />
          <KPI label="Significance" value="p=0.03 • Power=84%" info={{ short: "p-value and statistical power; α=0.05, target 80%.", long: "Significance & Power: p-value (probability result is by chance) and test power (probability to detect true effect); default α=0.05, power target 80%." }} />
        </section>

        {/* Charts row: DiD + Waterfall + Elasticity */}
        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-8 min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Difference‑in‑Differences <Info short="Compares change over time vs matched control to isolate promo impact." long="Diff-in-Diff: Compares change over time vs matched control to isolate promo impact." /></CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              <ChartContainer config={{ t: { label: "Treatment" }, c: { label: "Control" } }} className="h-full">
                <LineChart data={[
                  { d: 0, t: 42, c: 41 },
                  { d: 1, t: 44, c: 42 },
                  { d: 2, t: 46, c: 42 },
                  { d: 3, t: 55, c: 45 }, // promo window starts
                  { d: 4, t: 58, c: 46 },
                  { d: 5, t: 60, c: 47 },
                ]}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="d" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ReferenceArea x1={3} x2={5} fill="hsl(var(--muted))" fillOpacity={0.3} />
                  <Line type="monotone" dataKey="t" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="c" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="md:col-span-4 min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Uplift waterfall <Info short="Baseline → Traffic → CVR → AOV → Cannibalization → Halo → Net." long="Uplift Waterfall: Baseline → Traffic lift → CVR lift → AOV change → Cannibalization → Halo → Net uplift. Each bar shows ₹ and % contribution." /></CardTitle>
            </CardHeader>
            <CardContent className="h-56 overflow-hidden">
              <ChartContainer config={{ v: { label: "₹ L" } }} className="w-full h-full aspect-auto">
                <BarChart data={[
                  { k: "Baseline", v: 0 },
                  { k: "Traffic", v: 3.2 },
                  { k: "CVR", v: 1.1 },
                  { k: "AOV", v: 0.6 },
                  { k: "Cannibalization", v: -0.9 },
                  { k: "Halo", v: 0.7 },
                  { k: "Net", v: 4.7 },
                ]}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="k" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="v" fill="hsl(var(--primary))" radius={3} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* Elasticity chart in its own row for better layout */}
        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-4 md:col-start-5 min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Elasticity: Spend → Sales <Info short="Slope of sales vs spend; higher slope = higher marginal ROI." long="Elasticity: Slope of sales vs spend around current point; higher slope = higher marginal ROI." /></CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ blinkit: { label: "Blinkit", color: "hsl(var(--primary))" }, zepto: { label: "Zepto", color: "hsl(var(--muted-foreground))" } }}
                className="w-full h-56 aspect-auto"
              >
                <LineChart data={response}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="spend" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="blinkit" stroke="var(--color-blinkit)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="zepto" stroke="var(--color-zepto)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* Row 3: Comp set + Actions */}
        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-8 min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Comp set: Price index vs rivals <Info short="Price parity: 100 = parity, >100 = we're pricier." long="Comp-set price index: Price parity measure (100 = parity, >100 = we're pricier)." /></CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City</TableHead>
                      <TableHead className="text-right">Our index</TableHead>
                      <TableHead className="text-right">Rival A</TableHead>
                      <TableHead className="text-right">Rival B</TableHead>
                      <TableHead className="text-right">Price gap</TableHead>
                      <TableHead className="text-right">CVR</TableHead>
                      <TableHead className="text-right">ROAS</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comp.map((r) => (
                      <TableRow key={r.city}>
                        <TableCell className="font-medium">{r.city}</TableCell>
                        <TableCell className="text-right">{r.ours}</TableCell>
                        <TableCell className="text-right">{r.rivalA}</TableCell>
                        <TableCell className="text-right">{r.rivalB}</TableCell>
                        <TableCell className="text-right">{((r.ours - Math.min(r.rivalA, r.rivalB)) / Math.min(r.rivalA, r.rivalB) * 100).toFixed(0)}%</TableCell>
                        <TableCell className="text-right">{(3.5 + Math.random()).toFixed(1)}%</TableCell>
                        <TableCell className="text-right">{(4.6 + Math.random()).toFixed(1)}×</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-4 min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => toast({ title: "Repeat", description: "+₹6.1L sales • ROAS 4.8x • Risk: Low" })}>Repeat</Button>
              <Button onClick={() => toast({ title: "Scale to cities", description: "+₹9.3L • ROAS 5.0x • Risk: Medium (OOS 7%)" })}>Scale to cities</Button>
              <Button variant="outline" onClick={() => toast({ title: "Switch to coupon", description: "−₹1.2L sales • ROAS 5.6x • Margin +₹0.5L" })}>Switch to coupon</Button>
              <Button variant="destructive" onClick={() => toast({ title: "Stop discount", description: "Sales −₹3.2L • Margin neutral • SoW −1.3pp" })}>Stop discount</Button>
              <Button onClick={() => toast({ title: "Test bundle", description: "Expected ROAS 5.4x • NTB% +4pp" })}>Test bundle</Button>
            </CardContent>
          </Card>
        </section>

        {/* Row 4: Retention after promo */}
        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Retention after promo <Info short="Repeat rate of promo buyers vs non‑promo baseline." long="Retention chart: Repeat purchase rate of promo buyers vs non‑promo baseline." /></CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              <ChartContainer config={{ promo: { label: "Promo cohort" }, base: { label: "Non‑promo cohort" } }} className="h-full">
                <LineChart data={[
                  { w: 0, promo: 100, base: 100 },
                  { w: 1, promo: 42, base: 36 },
                  { w: 2, promo: 30, base: 24 },
                  { w: 3, promo: 24, base: 18 },
                  { w: 4, promo: 19, base: 15 },
                  { w: 5, promo: 15, base: 12 },
                  { w: 6, promo: 12, base: 10 },
                ]}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="w" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="promo" stroke="hsl(var(--primary))" dot={false} />
                  <Line type="monotone" dataKey="base" stroke="hsl(var(--muted-foreground))" dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default BrandPromotionsPricing;


