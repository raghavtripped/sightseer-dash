import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ExportBar from "@/components/ExportBar";
import KPI from "@/components/KPI";
import Info from "@/components/Info";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ScatterChart, Scatter, ZAxis, Tooltip as RTooltip, ReferenceLine, LineChart, Line, AreaChart, Area } from "recharts";

type SkuRow = {
  sku: string;
  impr: number;
  clicks: number;
  ctr: number; // clicks / impr
  details?: number;
  conv: number;
  cvr: number; // conv / clicks
  sales: number; // Lakh
  spend: number; // Lakh
  roas: number; // sales / spend
  cpa: number; // spend / conv in ₹
  aov: number; // sales/conv in ₹
  price: number;
  priceIndex: number; // ours / rival avg
  rating: number;
  stock: "In stock" | "Low" | "OOS";
  oosPct: number; // last 7d % time OOS
  shelfShare: number; // % top10 placements
  searchShare: number; // % impressions on top queries
  contentScore: number; // 0-100
  promo?: string;
  ntbPct: number; // New-to-brand %
  mode: "AI" | "Manual";
};

const rows: SkuRow[] = [
  {
    sku: "Aloo Tikki 500g",
    impr: 82000,
    clicks: 2100,
    ctr: 2.56,
    details: 1400,
    conv: 260,
    cvr: 12.38,
    sales: 7.2,
    spend: 1.2,
    roas: 6.0,
    cpa: 112,
    aov: 277,
    price: 110,
    priceIndex: 1.02,
    rating: 4.3,
    stock: "In stock",
    oosPct: 3,
    shelfShare: 36,
    searchShare: 28,
    contentScore: 86,
    promo: "10% off",
    ntbPct: 24,
    mode: "AI",
  },
  {
    sku: "Veg Nuggets 500g",
    impr: 64000,
    clicks: 1700,
    ctr: 2.66,
    details: 1000,
    conv: 180,
    cvr: 10.59,
    sales: 5.1,
    spend: 1.16,
    roas: 4.4,
    cpa: 128,
    aov: 283,
    price: 145,
    priceIndex: 1.05,
    rating: 4.1,
    stock: "Low",
    oosPct: 9,
    shelfShare: 27,
    searchShare: 22,
    contentScore: 72,
    ntbPct: 18,
    mode: "AI",
  },
  {
    sku: "Fries 750g",
    impr: 54000,
    clicks: 1200,
    ctr: 2.22,
    details: 760,
    conv: 130,
    cvr: 10.83,
    sales: 3.8,
    spend: 0.98,
    roas: 3.9,
    cpa: 142,
    aov: 292,
    price: 160,
    priceIndex: 1.08,
    rating: 4.2,
    stock: "OOS",
    oosPct: 18,
    shelfShare: 22,
    searchShare: 19,
    contentScore: 64,
    ntbPct: 15,
    mode: "Manual",
  },
];

const kpis = {
  avgRoas: "4.8x",
  hero: "5 / 18",
  laggard: "4 / 18",
  oosSkus: "3",
  spend: "₹48.3L",
  sales: "₹2.31Cr",
  oosSaved: "₹2.7L",
  rating: "4.2",
};

const selectedSku = rows[0];

const BrandSkuPerformance: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<SkuRow | null>(null);

  return (
    <>
      <Helmet>
        <title>SKU Performance Drilldown – Synapse</title>
        <meta name="description" content="Table and charts to identify hero and laggard SKUs with actions." />
        <link rel="canonical" href="/sku-performance" />
      </Helmet>
      <DashboardLayout title="SKU Performance Drilldown" subtitle="Which SKUs to back off / double down?">
        {/* Row 1: KPI strip */}
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KPI label="Avg ROAS 7d" value={kpis.avgRoas} info={{ short: "Revenue attributed ÷ Ad spend (last 7 days).", long: "ROAS: Revenue attributed ÷ Ad spend (current attribution: last-click, same-day)." }} intent="good" />
          <KPI label="Hero SKUs" value={kpis.hero} info={{ short: "ROAS ≥ 4.5 & Conv ≥ 100 & OOS% < 5%.", long: "Hero/Laggard rules: See “Thresholds” help.\n\nHero: ROAS ≥ 4.5 AND Conv ≥ 100 (7d) AND OOS% < 5%.\nLaggard: ROAS < 4.0 AND Conv ≥ 50 OR OOS% ≥ 15%.\nThin data: Conv < 30 (7d) → show ⚠︎ and suppress strict categorization." }} />
          <KPI label="Laggard SKUs" value={kpis.laggard} info={{ short: "ROAS < 4.0 or OOS% ≥ 15% with sufficient data.", long: "Hero/Laggard rules: See “Thresholds” help." }} intent="bad" />
          <KPI label="OOS SKUs (any city)" value={kpis.oosSkus} info={{ short: "% of SKUs with any city OOS in last 24h.", long: "OOS%: % time a SKU was unavailable in a city while ads were on." }} intent="warn" />
          <KPI label="Spend (7d)" value={kpis.spend} info={{ short: "Total ad spend last 7 days." }} />
          <KPI label="Sales (7d)" value={kpis.sales} info={{ short: "Attributed revenue last 7 days." }} />
          <KPI label="OOS-saved spend (7d)" value={kpis.oosSaved} info={{ short: "Spend avoided due to OOS guardrails." }} />
          <KPI label="Avg Rating" value={kpis.rating} info={{ short: "Weighted average rating across SKUs." }} />
        </section>

        {/* Row 2: Table + Charts */}
        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-8">
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">SKU table</CardTitle>
              <div className="flex items-center gap-2">
                <ExportBar />
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Impr</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">CTR <Info short="Clicks ÷ Impressions." long="CVR/CTR formulae: CTR = Clicks ÷ Impressions. CVR = Conversions ÷ Clicks." /></TableHead>
                    <TableHead className="text-right">Detail views</TableHead>
                    <TableHead className="text-right">Conv</TableHead>
                    <TableHead className="text-right">CVR <Info short="Conversions ÷ Clicks." long="CVR: Conversions ÷ Clicks." /></TableHead>
                    <TableHead className="text-right">Sales (₹ L)</TableHead>
                    <TableHead className="text-right">ROAS <Info short="Revenue attributed ÷ Ad spend (last-click, same-day)." long="ROAS: Revenue attributed ÷ Ad spend (current attribution: last-click, same-day)." /></TableHead>
                    <TableHead className="text-right">CPA <Info short="Ad spend ÷ Conversions (orders)." long="CPA: Ad spend ÷ Conversions (orders)." /></TableHead>
                    <TableHead className="text-right">AOV <Info short="Sales ÷ Conversions." long="AOV: Sales ÷ Conversions." /></TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Price index <Info short="Our price ÷ Rival average; 1.00 = parity, >1 pricier." long="Price index: Our price ÷ Rival average; 1.00 = parity, >1 = we’re pricier." /></TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">OOS% <Info short="% time unavailable while ads were on (7d)." long="OOS%: % time a SKU was unavailable in a city while ads were on." /></TableHead>
                    <TableHead className="text-right">Shelf share <Info short="% of top-10 placements for target searches (city-weighted)." long="Share of shelf: % of top-10 placements your SKUs hold for target queries (city-weighted)." /></TableHead>
                    <TableHead className="text-right">Search share <Info short="% impressions on tracked keywords." long="Share of search: % of impressions your SKUs receive for tracked keywords." /></TableHead>
                    <TableHead className="text-right">Content score <Info short="Checklist score for images, bullets, video, title, attributes." long="Content score: Checklist-based score for images, bullets, video, title, attributes." /></TableHead>
                    <TableHead className="text-right">NTB% <Info short="% orders from first-time brand buyers." long="NTB%: % orders from first-time buyers of the brand (platform or modeled)." /></TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Promo</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.sku} className="cursor-pointer" onClick={() => { setActive(r); setOpen(true); }}>
                      <TableCell className="font-medium">{r.sku}</TableCell>
                      <TableCell className="text-right">{r.impr.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.ctr.toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{r.details?.toLocaleString() ?? "-"}</TableCell>
                      <TableCell className="text-right">{r.conv.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.cvr.toFixed(2)}%</TableCell>
                      <TableCell className="text-right">{r.sales.toFixed(1)}</TableCell>
                      <TableCell className={"text-right " + (r.roas >= 4.5 ? "text-emerald-600" : r.roas >= 4 ? "text-amber-600" : "text-red-600")}>
                        {r.roas.toFixed(1)}×
                      </TableCell>
                      <TableCell className="text-right">₹{r.cpa}</TableCell>
                      <TableCell className="text-right">₹{r.aov}</TableCell>
                      <TableCell className="text-right">₹{r.price}</TableCell>
                      <TableCell className="text-right">{r.priceIndex.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{r.rating.toFixed(1)}</TableCell>
                      <TableCell>{r.stock}</TableCell>
                      <TableCell className="text-right">{r.oosPct}%</TableCell>
                      <TableCell className="text-right">{r.shelfShare}%</TableCell>
                      <TableCell className="text-right">{r.searchShare}%</TableCell>
                      <TableCell className="text-right">{r.contentScore}</TableCell>
                      <TableCell className="text-right">{r.ntbPct}%</TableCell>
                      <TableCell>{r.mode}</TableCell>
                      <TableCell>{r.promo || "-"}</TableCell>
                      <TableCell className="space-x-2">
                        <Badge variant={r.roas >= 4.5 && r.conv >= 100 && r.oosPct < 5 ? "default" : "secondary"}>{r.roas >= 4.5 && r.conv >= 100 && r.oosPct < 5 ? "Hero" : r.roas < 4 || r.oosPct >= 15 ? "Laggard" : "—"}</Badge>
                        <Button size="sm" variant="secondary">Hero</Button>
                        <Button size="sm" variant="outline">Nurture</Button>
                        <Button size="sm" variant="ghost">Fix content</Button>
                        <Button size="sm">Trial promo</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card className="md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Charts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Quadrant scatter */}
              <div className="h-56">
                <ChartContainer config={{ sku: { label: "SKU" } }} className="h-full">
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis dataKey="sales" name="Sales (L)" type="number" />
                    <YAxis dataKey="roas" name="ROAS" type="number" />
                    <ZAxis dataKey="ntbPct" range={[60, 260]} name="NTB%" />
                     <RTooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: unknown, n: unknown) => [typeof v === "number" ? v.toFixed(2) : String(v), String(n)]} />
                    <ReferenceLine y={4.5} stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" />
                    <Scatter data={rows.map(r => ({ ...r, fill: `hsl(var(--primary))` }))} fill="var(--color-sku)" />
                  </ScatterChart>
                </ChartContainer>
              </div>
              {/* Top 5 dual bars */}
              <div className="h-44">
                <ChartContainer
                  config={{ sales: { label: "Sales (L)", color: "hsl(var(--primary))" }, roas: { label: "ROAS", color: "hsl(var(--muted-foreground))" } }}
                  className="h-full"
                >
                  <BarChart data={[...rows].sort((a,b)=>b.sales-a.sales).slice(0,5)}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="sku" tickLine={false} axisLine={false} hide />
                    <YAxis tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="sales" radius={3} fill="var(--color-sales)" />
                    <Bar dataKey="roas" radius={3} fill="var(--color-roas)" />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Price index vs CVR</div>
                  <div className="font-medium">r = −0.42</div>
                </div>
                <div className="rounded-md border p-3">
                  <div className="text-xs text-muted-foreground">Content score vs ROAS</div>
                  <div className="font-medium">r = +0.37</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Row 3: Lost sales + Drivers waterfall for selected */}
        <section className="grid gap-4 md:grid-cols-12">
          <Card className="md:col-span-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Lost-Sales estimator <Info short="Modeled difference between expected and actual orders, controlling for traffic & price." /></CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="font-medium">Aloo Tikki 500g: Lost sales ₹3.4L (±₹0.8L)</div>
              <div className="text-muted-foreground mt-1">Drivers: OOS 11% • Shelf share 22%</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Drivers waterfall</CardTitle>
            </CardHeader>
            <CardContent className="h-56">
              <ChartContainer config={{ v: { label: "Impact (₹ L)" } }} className="h-full">
                <BarChart data={[
                  { name: "Baseline", v: 5.0 },
                  { name: "Traffic", v: 0.8 },
                  { name: "CVR", v: 0.4 },
                  { name: "AOV", v: 0.2 },
                  { name: "Price gap", v: -0.3 },
                  { name: "OOS", v: -0.9 },
                  { name: "Content", v: 0.2 },
                  { name: "Net", v: 5.4 },
                ]}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="v" radius={3} fill="hsl(var(--primary))" />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* Row click drawer */}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{active?.sku}</DrawerTitle>
              <DrawerDescription>Today and 7d performance</DrawerDescription>
            </DrawerHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-4">
              <KPI label="Spend" value={`₹${(active?.spend ?? 0).toFixed(1)}L`} />
              <KPI label="Sales" value={`₹${(active?.sales ?? 0).toFixed(1)}L`} />
              <KPI label="ROAS" value={`${active?.roas.toFixed(1)}×`} />
              <KPI label="CPA" value={`₹${active?.cpa}`} />
            </div>
            <div className="px-4 py-3">
              <Tabs defaultValue="platforms">
                <TabsList>
                  <TabsTrigger value="platforms">Platforms</TabsTrigger>
                  <TabsTrigger value="cities">Cities</TabsTrigger>
                  <TabsTrigger value="dayparts">Dayparts</TabsTrigger>
                </TabsList>
                <TabsContent value="platforms">
                  <div className="h-40">
                    <ChartContainer config={{ spend: { label: "Spend" }, sales: { label: "Sales" } }} className="h-full">
                      <AreaChart data={[{ k: "Blinkit", spend: 0.6, sales: 3.2 }, { k: "Zepto", spend: 0.4, sales: 2.1 }] }>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="k" hide />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area dataKey="spend" fill="hsl(var(--muted))" stroke="hsl(var(--muted-foreground))" />
                        <Area dataKey="sales" fill="hsl(var(--primary)/0.3)" stroke="hsl(var(--primary))" />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </TabsContent>
                <TabsContent value="cities">
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { city: "Delhi", roas: 5.6, oos: 4 },
                      { city: "Mumbai", roas: 4.3, oos: 7 },
                      { city: "Pune", roas: 3.9, oos: 11 },
                    ].map((c) => (
                      <div key={c.city} className="rounded-md border p-2">
                        <div className="font-medium">{c.city}</div>
                        <div className="text-muted-foreground">ROAS {c.roas}× • OOS {c.oos}%</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="dayparts">
                  <div className="h-40">
                    <ChartContainer config={{ cvr: { label: "CVR" } }} className="h-full">
                      <LineChart data={[{ t: "Breakfast", cvr: 3.1 }, { t: "Lunch", cvr: 3.8 }, { t: "Snacks", cvr: 4.2 }, { t: "Dinner", cvr: 5.0 }]}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="t" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="cvr" stroke="hsl(var(--primary))" />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DrawerFooter>
              <div className="text-xs text-muted-foreground px-1">Recommendation: Increase Zepto Dinner +₹40k → +210 conv (±60), ROAS 5.3x; Risk: low (stock ≥95%).</div>
              <DrawerClose asChild>
                <Button variant="secondary">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </DashboardLayout>
    </>
  );
};

export default BrandSkuPerformance;


