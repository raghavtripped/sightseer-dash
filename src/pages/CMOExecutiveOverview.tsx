import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ExportBar from "@/components/ExportBar";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, ReferenceDot, ReferenceLine, ComposedChart } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useFilters } from "@/context/FiltersContext";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChannelDatum = { channel: string; spend: number; sales: number };

const rawChannelMix: ChannelDatum[] = [
  { channel: "Blinkit", spend: 18, sales: 26 },
  { channel: "Zepto", spend: 14, sales: 20 },
  { channel: "Instamart", spend: 16, sales: 18 },
  { channel: "Amazon", spend: 22, sales: 20 },
  { channel: "Flipkart", spend: 30, sales: 16 },
];

const cityLeaderboard = [
  { city: "Delhi", roas: 5.2, ntb: 44, sales: 12.3, cpa: 115, trend: +6 },
  { city: "Mumbai", roas: 4.8, ntb: 41, sales: 10.9, cpa: 128, trend: +3 },
  { city: "Bengaluru", roas: 4.6, ntb: 39, sales: 9.8, cpa: 131, trend: -2 },
  { city: "Pune", roas: 4.1, ntb: 35, sales: 7.4, cpa: 142, trend: -4 },
  { city: "Hyderabad", roas: 4.0, ntb: 36, sales: 6.9, cpa: 138, trend: +1 },
];

const spendSalesTrendRaw = Array.from({ length: 8 }).map((_, i) => ({
  week: `W${i + 1}`,
  spend: 30 + i * 3 + (i % 2 === 0 ? 2 : -1),
  sales: 40 + i * 4 + (i % 3 === 0 ? 3 : -2),
  planSpend: 28 + i * 3.2,
  planSales: 38 + i * 3.8,
}));

function indexSeries(data: { spend: number; sales: number }[]) {
  const baseSpend = data[0]?.spend || 1;
  const baseSales = data[0]?.sales || 1;
  return data.map((d) => ({
    ...d,
    spendIdx: Math.round((d.spend / baseSpend) * 100),
    salesIdx: Math.round((d.sales / baseSales) * 100),
  }));
}

const spendSalesTrend = indexSeries(spendSalesTrendRaw);

const pieColors = ["#4f46e5", "#06b6d4", "#16a34a", "#f59e0b", "#ef4444"]

const platforms = rawChannelMix.map((c) => c.channel);
const budgetVariants = {
  current: [24, 18, 20, 16, 22],
  last: [22, 16, 19, 18, 25],
  plan: [26, 20, 18, 16, 20],
};

const contributionItems = [
  { key: "baseline", label: "Baseline ROAS", delta: 0, roas: 3.8, link: null as string | null },
  { key: "mix", label: "Mix effect", delta: +0.3, roas: 4.1, link: "/strategic-heatmaps" },
  { key: "price", label: "Price/Promo", delta: +0.2, roas: 4.3, link: "/promotions-pricing" },
  { key: "creative", label: "Creative/CTR", delta: -0.1, roas: 4.2, link: "/creative-performance" },
  { key: "cvr_oos", label: "CVR & OOS", delta: +0.2, roas: 4.4, link: "/availability-watchtower" },
  { key: "synapse", label: "Synapse uplift", delta: +0.2, roas: 4.6, link: "/strategic-heatmaps" },
  { key: "final", label: "Final ROAS", delta: 0, roas: 4.6, link: null as string | null },
] as const;

const ExecutiveOverview: React.FC = () => {
  const { setFilters } = useFilters();
  const navigate = useNavigate();

  const channelMix = rawChannelMix.map((c) => {
    const maxWithin = Math.max(c.spend, c.sales) || 1;
    const spendIdx = Math.round((c.spend / maxWithin) * 100);
    const salesIdx = Math.round((c.sales / maxWithin) * 100);
    return { ...c, spendIdx, salesIdx, efficiency: (c.sales / Math.max(c.spend, 1)) };
  });

  const handlePlatformClick = (platform: string) => {
    setFilters((f) => ({ ...f, platforms: [platform] }));
    navigate("/strategic-heatmaps");
  };

  const [smooth, setSmooth] = React.useState(true);
  const [budgetTab, setBudgetTab] = React.useState<"current" | "last" | "plan">("current");

  const InfoLabel: React.FC<{ label: string; tip?: string }> = ({ label, tip }) => (
    <div className="inline-flex items-center gap-1">
      <span>{label}</span>
      {tip && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button aria-label={`Info about ${label}`} className="text-muted-foreground hover:text-foreground"><Info size={14} /></button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{tip}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Executive overview — Synapse</title>
        <meta name="description" content="High-level performance snapshot: ROAS, spend, sales, and contribution." />
        <link rel="canonical" href="/executive-overview" />
      </Helmet>

      <DashboardLayout title="Executive overview" subtitle="Are we winning, where, and why?">
        <section className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
          <Kpi title={<InfoLabel label="Overall ROAS" tip="ROAS = Revenue attributed ÷ Ad spend (current attribution window: Last click, same-day, change in Settings)." />} value="4.6x" delta="+0.3 vs prev" state="good" />
          <Kpi title={<InfoLabel label="Quick commerce ROAS" tip="ROAS = Revenue attributed ÷ Ad spend." />} value="5.1x" delta="+0.4" state="good" />
          <Kpi title={<InfoLabel label="Traditional e-commerce ROAS" tip="ROAS = Revenue attributed ÷ Ad spend." />} value="3.9x" delta="-0.2" state="warn" />
          <Kpi title={<InfoLabel label="Attributable Sales" tip="Attributed sales in ₹ under current window." />} value="₹48.3L" delta="+₹3.1L" />
          <Kpi title={<InfoLabel label="Spend (7d)" tip="Masked unless Finance role. Shows 7d spend." />} value="₹48.3L" delta="+₹2.0L" />
          <Kpi title={<InfoLabel label="CPA" tip="CPA = Ad spend ÷ Orders." />} value="₹128" delta="-₹6" />
          <Kpi title={<InfoLabel label="NTB%" tip="% orders from first-time buyers (platform or modeled)." />} value="41%" delta="+2%" />
          <Kpi title={<InfoLabel label="Share of Wallet" tip="Brand sales ÷ Category sales (same scope)." />} value="26%" delta="+1%" />
        </section>

        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Channel mix (indexed)</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ spendIdx: { label: "Spend", color: "hsl(var(--primary))" }, salesIdx: { label: "Sales", color: "hsl(var(--muted-foreground))" } }}
                className="h-72"
              >
                <BarChart data={channelMix}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="channel" tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} formatter={(value: any, name: any, item: any) => {
                    const { spend, sales } = item?.payload ?? {};
                    return [
                      value + " (idx)",
                      name === "spendIdx" ? `Spend • ₹${spend?.toLocaleString?.()}` : `Sales • ₹${sales?.toLocaleString?.()}`,
                    ];
                  }} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="spendIdx" radius={4} onClick={(d) => handlePlatformClick((d as any).channel)} />
                  <Bar dataKey="salesIdx" radius={4} onClick={(d) => handlePlatformClick((d as any).channel)} />
                </BarChart>
              </ChartContainer>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {channelMix.map((c) => (
                  <div key={c.channel} className="flex items-center justify-between rounded-md border p-2 text-xs">
                    <span className="font-medium cursor-pointer" onClick={() => handlePlatformClick(c.channel)}>{c.channel}</span>
                    <Badge variant={c.efficiency >= 1 ? "default" : "destructive"}>
                      {c.efficiency >= 1 ? "Efficiency +" : "Efficiency −"} {c.efficiency.toFixed(2)}×
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-4 space-y-4">
            <Card>
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-sm">City leaderboard</CardTitle>
                <ExportBar />
              </CardHeader>
              <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>City</TableHead>
                      <TableHead className="text-right">ROAS</TableHead>
                      <TableHead className="text-right">NTB%</TableHead>
                      <TableHead className="text-right">Sales (₹L)</TableHead>
                      <TableHead className="text-right">CPA</TableHead>
                      <TableHead className="text-right">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cityLeaderboard.map((c) => (
                      <TableRow key={c.city} className="cursor-pointer" onClick={() => navigate(`/sku-performance?city=${encodeURIComponent(c.city)}`)}>
                        <TableCell className="font-medium">{c.city}</TableCell>
                        <TableCell className={"text-right " + (c.roas >= 4.5 ? "text-success" : c.roas >= 4 ? "text-amber-600" : "text-destructive")}>
                          {c.roas.toFixed(1)}×
                        </TableCell>
                        <TableCell className="text-right">{c.ntb}%</TableCell>
                        <TableCell className="text-right">{c.sales.toFixed(1)}</TableCell>
                        <TableCell className="text-right">₹{c.cpa}</TableCell>
                        <TableCell className="text-right">
                          {c.trend >= 0 ? (
                            <span className="inline-flex items-center gap-1 text-success"><TrendingUp size={14}/>+{c.trend}%</span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-destructive"><TrendingDown size={14}/>{c.trend}%</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-sm">Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => window.print()}>Export Board Pack (PDF)</Button>
                <Button onClick={() => navigate("/strategic-heatmaps?emailSchedule=Mon0900IST")}>Schedule weekly email</Button>
                <Button onClick={() => navigate("/strategic-heatmaps?reallocate=1")}>Recommend reallocation</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-8">
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm">Spend vs Sales (8w, indexed)</CardTitle>
              <div className="flex items-center gap-2 text-xs">
                <Button size="sm" variant={smooth ? "default" : "outline"} onClick={() => setSmooth(true)}>Smooth (7d MA)</Button>
                <Button size="sm" variant={!smooth ? "default" : "outline"} onClick={() => setSmooth(false)}>Actual</Button>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ spendIdx: { label: "Spend", color: "hsl(var(--primary))" }, salesIdx: { label: "Sales", color: "hsl(var(--muted-foreground))" }, plan: { label: "Plan", color: "#94a3b8" } }}
                className="h-64"
              >
                <ComposedChart data={spendSalesTrend}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} domain={[80, "dataMax + 20"]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type={smooth ? "monotone" : "linear"} dataKey="spendIdx" stroke="var(--color-spendIdx)" strokeWidth={2} dot={!smooth} />
                  <Line type={smooth ? "monotone" : "linear"} dataKey="salesIdx" stroke="var(--color-salesIdx)" strokeWidth={2} dot={!smooth} />
                  <Line type={smooth ? "monotone" : "linear"} dataKey="planSpend" stroke="var(--color-plan)" strokeDasharray="4 4" dot={false} />
                  <Line type={smooth ? "monotone" : "linear"} dataKey="planSales" stroke="var(--color-plan)" strokeDasharray="2 6" dot={false} />
                  <ReferenceDot x={"W3"} y={spendSalesTrend[2].salesIdx} r={4} fill="#f59e0b" stroke="none" />
                  <ReferenceDot x={"W6"} y={spendSalesTrend[5].spendIdx} r={4} fill="#10b981" stroke="none" />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="md:col-span-4">
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm">Budget mix</CardTitle>
              <Tabs value={budgetTab} onValueChange={(v) => setBudgetTab(v as any)}>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="current">Current</TabsTrigger>
                  <TabsTrigger value="last">Last</TabsTrigger>
                  <TabsTrigger value="plan">Plan</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ curr: { label: "Allocation", color: "hsl(var(--primary))" } }}
                className="h-56"
              >
                <BarChart data={platforms.map((p, i) => ({ platform: p, pct: (budgetVariants as any)[budgetTab][i] }))}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="platform" tickLine={false} axisLine={false} />
                  <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="pct" stackId="one" radius={4} />
                </BarChart>
              </ChartContainer>
              {budgetTab !== "plan" && (
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {platforms.map((p, i) => {
                    const plan = budgetVariants.plan[i];
                    const curr = (budgetVariants as any)[budgetTab][i];
                    const variance = Math.round(curr - plan);
                    const isPos = variance >= 0;
                    return (
                      <div key={p} className="flex items-center justify-between rounded-md border px-2 py-1">
                        <span>{p}</span>
                        <Badge variant={isPos ? "default" : "destructive"}>{isPos ? "+" : ""}{variance}% vs plan</Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Contribution bridge with methodology and footer rail */}
        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-8">
            <CardHeader className="pb-2 flex items-center justify-between">
              <CardTitle className="text-sm">Contribution bridge</CardTitle>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline" className="gap-2"><Info size={14}/> Methodology</Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="max-w-md text-xs leading-relaxed">
                  Inputs: platform/daypart mix, price/promo, creative CTR, CVR, OOS savings, optimization uplift. Lookback: 28d. Δ bars show change in ROAS and ₹ impact.
                </PopoverContent>
              </Popover>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ pos: { label: "Δ ROAS +", color: "#16a34a" }, neg: { label: "Δ ROAS −", color: "#ef4444" } }} className="h-64">
                <ComposedChart data={contributionItems.map((it) => ({ name: it.label, pos: Math.max(it.delta, 0), neg: Math.min(it.delta, 0), roas: it.roas }))}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="pos" stackId="a" radius={4} />
                  <Bar dataKey="neg" stackId="a" radius={4} />
                  <ReferenceLine y={3.8} stroke="#94a3b8" strokeDasharray="3 3" label={{ value: "Baseline", position: "insideTopLeft", fontSize: 10 }} />
                </ComposedChart>
              </ChartContainer>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                {contributionItems.filter((i) => i.key !== "baseline" && i.key !== "final").map((i) => (
                  <Button key={i.key} variant="secondary" onClick={() => i.link && navigate(i.link)}>
                    Explore {i.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-xs">
              <Badge variant="secondary">Data freshness: 23 min ago</Badge>
              <Badge variant="secondary">Attribution: Last click (same-day)</Badge>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">API health: OK</Badge>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

const Kpi: React.FC<{ title: React.ReactNode; value: string; delta?: string; state?: "good" | "warn" | "bad" }> = ({ title, value, delta, state }) => (
  <Card className="rounded-xl">
    <CardHeader className="pb-1">
      <CardTitle className="text-xs text-muted-foreground font-normal">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={"text-xl font-semibold " + (state === "good" ? "text-success" : state === "bad" ? "text-destructive" : state === "warn" ? "text-amber-600" : "")}>{value}</div>
      {delta && <div className="text-xs text-muted-foreground">{delta}</div>}
    </CardContent>
  </Card>
);

export default ExecutiveOverview;


