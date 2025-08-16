import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useLocation } from "react-router-dom";

const dayparts = ["Breakfast", "Lunch", "Snacks", "Dinner"] as const;
const platforms = ["Blinkit", "Zepto", "Instamart", "Amazon", "Flipkart"] as const;

type MetricKey = "ROAS" | "CPA" | "CVR" | "Conversions" | "Spend";
const metrics: MetricKey[] = ["ROAS", "CPA", "CVR", "Conversions", "Spend"];
const comparators = ["Prev 7d", "4-wk avg"] as const;

const roasMatrix: Record<string, Record<string, number>> = {
  Blinkit: { Breakfast: 5.2, Lunch: 4.8, Snacks: 6.1, Dinner: 5.7 },
  Zepto: { Breakfast: 4.4, Lunch: 4.0, Snacks: 4.9, Dinner: 5.1 },
  Instamart: { Breakfast: 3.8, Lunch: 4.1, Snacks: 4.3, Dinner: 4.0 },
  Amazon: { Breakfast: 3.5, Lunch: 3.7, Snacks: 3.9, Dinner: 3.6 },
  Flipkart: { Breakfast: 3.9, Lunch: 4.2, Snacks: 4.0, Dinner: 3.8 },
};

const deltaMatrix: Record<string, Record<string, number>> = {
  Blinkit: { Breakfast: +0.3, Lunch: +0.2, Snacks: +0.6, Dinner: +0.1 },
  Zepto: { Breakfast: -0.1, Lunch: -0.2, Snacks: +0.3, Dinner: +0.4 },
  Instamart: { Breakfast: +0.2, Lunch: +0.1, Snacks: -0.2, Dinner: -0.1 },
  Amazon: { Breakfast: -0.3, Lunch: -0.1, Snacks: +0.1, Dinner: -0.2 },
  Flipkart: { Breakfast: +0.1, Lunch: +0.2, Snacks: -0.1, Dinner: -0.2 },
};

const sigMatrix: Record<string, Record<string, boolean>> = {
  Blinkit: { Breakfast: true, Lunch: false, Snacks: true, Dinner: false },
  Zepto: { Breakfast: false, Lunch: true, Snacks: true, Dinner: true },
  Instamart: { Breakfast: true, Lunch: false, Snacks: false, Dinner: false },
  Amazon: { Breakfast: true, Lunch: false, Snacks: false, Dinner: false },
  Flipkart: { Breakfast: false, Lunch: false, Snacks: false, Dinner: true },
};

const StrategicHeatmaps: React.FC = () => {
  const { toast } = useToast();
  const weeks = Array.from({ length: 8 }).map((_, i) => `W${i + 1}`);
  const series = weeks.map((w, i) => ({ week: w, roas: 3.5 + (i * 0.2) + (i % 3 === 0 ? 0.3 : -0.1), cpa: 160 - i * 3, sow: 24 + (i % 2 === 0 ? 2 : -1), ntb: 38 + (i % 3 === 0 ? 3 : -1) }));

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [openRecommend, setOpenRecommend] = React.useState(params.get("reallocate") === "1");
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [selectedCell, setSelectedCell] = React.useState<{ platform: string; daypart: string } | null>(null);
  const [metric, setMetric] = React.useState<MetricKey>("ROAS");
  const [compare, setCompare] = React.useState<typeof comparators[number]>("Prev 7d");
  const [simAmount, setSimAmount] = React.useState<number>(4);
  const [trendToggle, setTrendToggle] = React.useState<"ROAS_CPA" | "SOW_NTB">("ROAS_CPA");

  const openCell = (platform: string, daypart: string) => {
    setSelectedCell({ platform, daypart });
    setOpenDrawer(true);
  };

  const recommend = () => setOpenRecommend(true);

  return (
    <>
      <Helmet>
        <title>Strategic heatmaps & trends — Synapse</title>
        <meta name="description" content="Heatmaps and trends to guide budget allocation by platform and daypart with geo insights." />
        <link rel="canonical" href="/strategic-heatmaps" />
      </Helmet>
      <DashboardLayout title="Strategic heatmaps & trends" subtitle="Where to push or pull budgets next?">
        {/* Row 1: Filters are global + metric and comparator */}
        <section className="flex flex-wrap items-center gap-2">
          <Select value={metric} onValueChange={(v) => setMetric(v as MetricKey)}>
            <SelectTrigger className="w-[220px]"><SelectValue placeholder="Metric" /></SelectTrigger>
            <SelectContent>
              {metrics.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={compare} onValueChange={(v) => setCompare(v as typeof comparators[number])}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Compare vs" /></SelectTrigger>
            <SelectContent>
              {Array.from(comparators).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </section>

        {/* Row 2: Heatmap and trend lines */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{metric} heatmap: Platform × Daypart</CardTitle>
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
                          const delta = deltaMatrix[p][d];
                          const sig = sigMatrix[p][d];
                          const ratio = Math.max(0, Math.min(1, (v - 3) / 3));
                          const bg = `rgba(16, 185, 129, ${0.12 + ratio * 0.45})`;
                          return (
                            <td key={d} className={`p-2 text-center rounded-md border cursor-pointer hover:scale-105 hover:bg-muted/30 transition-all duration-200 border-2 border-green-500 ${sig ? "border-dashed" : "border-transparent"}`} style={{ backgroundColor: bg }} onClick={() => openCell(p, d)}>
                              <div className="font-medium">{v.toFixed(1)}{metric === "ROAS" ? "×" : ""}</div>
                              <div className={`text-[10px] ${delta >= 0 ? "text-emerald-600" : "text-red-600"}`}>{delta >= 0 ? "+" : ""}{metric === "ROAS" ? `${delta.toFixed(1)}×` : `${delta}%`}</div>
                            </td>
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
              <CardTitle className="text-sm">Trend lines: 8-week {trendToggle === "ROAS_CPA" ? "ROAS & CPA" : "SoW & NTB%"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center gap-2 text-xs">
                <Button size="sm" variant={trendToggle === "ROAS_CPA" ? "default" : "outline"} className="hover:bg-primary/90 transition-colors duration-200 border-2 border-green-500" onClick={() => setTrendToggle("ROAS_CPA")}>ROAS & CPA</Button>
                <Button size="sm" variant={trendToggle === "SOW_NTB" ? "default" : "outline"} className="hover:bg-primary/90 transition-colors duration-200 border-2 border-green-500" onClick={() => setTrendToggle("SOW_NTB")}>SoW & NTB%</Button>
              </div>
              <ChartContainer
                config={{ roas: { label: "ROAS", color: "hsl(var(--primary))" }, cpa: { label: "CPA", color: "hsl(var(--muted-foreground))" }, sow: { label: "SoW", color: "#0ea5e9" }, ntb: { label: "NTB%", color: "#16a34a" } }}
                className="h-64"
              >
                <LineChart data={series}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {trendToggle === "ROAS_CPA" ? (
                    <>
                      <Line type="monotone" dataKey="roas" stroke="var(--color-roas)" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="cpa" stroke="var(--color-cpa)" strokeWidth={2} dot={false} />
                    </>
                  ) : (
                    <>
                      <Line type="monotone" dataKey="sow" stroke="var(--color-sow)" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="ntb" stroke="var(--color-ntb)" strokeWidth={2} dot={false} />
                    </>
                  )}
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        {/* Row 3: Geo cards + Insights & Reallocation */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Geo ROAS & NTB% by city</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[{ city: "Delhi", roas: 5.2, ntb: 44, sow: 28, oos: 3 }, { city: "Mumbai", roas: 4.8, ntb: 40, sow: 25, oos: 4 }, { city: "Bengaluru", roas: 4.6, ntb: 39, sow: 22, oos: 5 }, { city: "Pune", roas: 4.1, ntb: 35, sow: 20, oos: 6 }].map((c) => (
                  <div key={c.city} className="rounded-md border p-3">
                    <div className="text-sm font-medium">{c.city}</div>
                    <div className="text-xs text-muted-foreground">ROAS {c.roas.toFixed(1)}× · NTB {c.ntb}% · SoW {c.sow}% · OOS {c.oos}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Insights</CardTitle>
              <Button size="sm" className="hover:bg-primary/90 transition-colors duration-200 border-2 border-green-500" onClick={recommend}>Recommend reallocation</Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <div className="font-medium">Top 3 hot spots</div>
                <ul className="list-disc ml-5 text-muted-foreground">
                  <li>Blinkit Snacks (Delhi) – High CVR + Low CPC</li>
                  <li>Zepto Dinner (Mumbai) – High NTB% + Improving SoW</li>
                  <li>Instamart Lunch (BLR) – Stable CVR, low CPA</li>
                </ul>
              </div>
              <div>
                <div className="font-medium">3 leak zones</div>
                <ul className="list-disc ml-5 text-muted-foreground">
                  <li>Amazon Breakfast – Low CTR + Price gap</li>
                  <li>Flipkart Dinner – OOS spikes</li>
                  <li>Instamart Snacks (Pune) – Rising CPA</li>
                </ul>
              </div>
              <div>
                <div className="font-medium">What changed this week</div>
                <ul className="list-disc ml-5 text-muted-foreground">
                  <li>+₹3.8L sales from Blinkit Snacks eve</li>
                  <li>−₹2.1L from Instamart breakfast in Pune</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Drawer for cell drivers */}
        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drivers: {selectedCell?.platform} · {selectedCell?.daypart}</DrawerTitle>
            </DrawerHeader>
            <div className="grid grid-cols-2 gap-4 p-4 text-sm">
              <div className="space-y-1">
                <div>CPC & CTR deltas</div>
                <div className="text-muted-foreground">CTR +0.4pp, CPC −₹0.7</div>
              </div>
              <div className="space-y-1">
                <div>CVR delta</div>
                <div className="text-muted-foreground">+0.6pp</div>
              </div>
              <div className="space-y-1">
                <div>OOS % in window</div>
                <div className="text-muted-foreground">2.1%</div>
              </div>
              <div className="space-y-1">
                <div>Price gap vs comp set</div>
                <div className="text-muted-foreground">-3% vs comp</div>
              </div>
              <div className="space-y-1">
                <div>Creative fatigue</div>
                <div className="text-muted-foreground">No fatigue flagged</div>
              </div>
              <div className="space-y-1">
                <Button variant="secondary" className="hover:bg-secondary/80 transition-colors duration-200 border-2 border-green-500">View similar cells</Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        {/* Reallocation modal */}
        <Dialog open={openRecommend} onOpenChange={setOpenRecommend}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Recommend reallocation</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="rounded-md border">
                <div className="grid grid-cols-5 gap-2 p-2 text-xs font-medium">
                  <div>From</div><div>To</div><div>Amount</div><div>Forecast</div><div>Constraints</div>
                </div>
                {[
                  { from: "Amazon Breakfast", to: "Blinkit Snacks", amt: "₹2L", forecast: "+1.2x ROAS, +500 conv", constraints: "min visibility ok" },
                  { from: "Flipkart Dinner", to: "Zepto Dinner", amt: "₹1L", forecast: "+0.7x ROAS, +220 conv", constraints: "caps ok" },
                ].map((r, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-2 border-t p-2">
                    <div>{r.from}</div>
                    <div>{r.to}</div>
                    <div>{r.amt}</div>
                    <div>{r.forecast}</div>
                    <div>{r.constraints}</div>
                  </div>
                ))}
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Total shift</div>
                <Slider defaultValue={[simAmount]} max={10} step={1} onValueChange={(v) => setSimAmount(v[0])} />
                <div className="mt-1 text-xs">₹{simAmount}L → ΔROAS +{(simAmount * 0.1).toFixed(1)}×, risk: Low</div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button variant="secondary" className="hover:bg-secondary/80 transition-colors duration-200 border-2 border-green-500">Save draft</Button>
                <Button className="hover:bg-primary/90 transition-colors duration-200 border-2 border-green-500" onClick={() => { toast({ title: "Approved", description: "Shift plan deployed and logged to Action Log" }); setOpenRecommend(false); }}>Approve</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    </>
  );
};

export default StrategicHeatmaps;


