import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type StockState = "In stock" | "Low" | "OOS" | "Unknown";
type AdsState = "Active" | "Paused-OOS" | "Paused-Guardrail";

type Row = {
  city: string;
  sku: string;
  platforms_live: string[];
  stock_state: StockState;
  availability_pct_24h: number; // 0-100
  next_eta: string; // ISO or human
  oos_risk_24h: number; // 0-1
  ads_state: AdsState;
  spend_7d: number;
  lost_sales_7d: number;
  substitution: { primary: string; backup1?: string; backup2?: string };
};

const tooltipCopy = {
  instock: "% SKUs in-stock: Share of tracked SKUs with availability ≥90% in last 24h (city-weighted).",
  cities: "Cities fully covered: Cities where all active SKUs are in-stock (no OOS/Low).",
  paused: "Ads paused due to OOS: Ad groups auto-paused in last 24h because availability hit zero.",
  saved: "Spend saved: Estimated ad spend avoided by pausing OOS ads (counterfactual burn).",
  risk: "OOS risk (next 24h): Probability of stockout from forecast + lead-time; shows SKUs above 40% risk.",
  ttr: "Avg time-to-restock: Median time from OOS detection to positive availability across cities.",
  subs: "Substitutions: Backup SKU mapping used when primary is OOS; controls cart-injection/reco ads.",
  blocked: "Blocked impressions: Estimated impressions not served due to OOS holds to avoid waste.",
  avail: "Avail%: % of checks with positive availability over the period.",
  lost: "Lost sales (est.): Modeled revenue missed due to OOS/Low availability while demand existed.",
};

const rows: Row[] = [
  { city: "Delhi", sku: "Aloo Tikki 500g", platforms_live: ["Blinkit","Zepto"], stock_state: "In stock", availability_pct_24h: 96, next_eta: "-", oos_risk_24h: 0.08, ads_state: "Active", spend_7d: 62000, lost_sales_7d: 0, substitution: { primary: "Aloo Tikki 500g", backup1: "Veg Nuggets 500g" } },
  { city: "Mumbai", sku: "Veg Nuggets 500g", platforms_live: ["Blinkit","Zepto"], stock_state: "OOS", availability_pct_24h: 4, next_eta: "2025-08-13T10:00:00+05:30", oos_risk_24h: 0.62, ads_state: "Paused-OOS", spend_7d: 84000, lost_sales_7d: 125000, substitution: { primary: "Veg Nuggets 500g", backup1: "Aloo Tikki 500g", backup2: "Fries 750g" } },
  { city: "Pune", sku: "Fries 750g", platforms_live: ["Instamart"], stock_state: "Low", availability_pct_24h: 31, next_eta: "2025-08-12T18:00:00+05:30", oos_risk_24h: 0.41, ads_state: "Paused-Guardrail", spend_7d: 41000, lost_sales_7d: 52000, substitution: { primary: "Fries 750g", backup1: "Wedges 750g" } },
];

const kpis = [
  { key: "% SKUs in-stock", value: "92%", tip: tooltipCopy.instock },
  { key: "Cities fully covered", value: "18 / 22", tip: tooltipCopy.cities },
  { key: "Ads paused due to OOS", value: "5", tip: tooltipCopy.paused },
  { key: "Spend saved (7d)", value: "₹2.7L", tip: tooltipCopy.saved },
  { key: "Current OOS risk (next 24h)", value: "7 SKUs", tip: tooltipCopy.risk },
  { key: "Avg time-to-restock", value: "16h", tip: tooltipCopy.ttr },
  { key: "Substitutions enabled", value: "9 routes", tip: tooltipCopy.subs },
  { key: "Blocked impressions (7d)", value: "1.1M", tip: tooltipCopy.blocked },
];

const donut = [ { name: "In stock", value: 78 }, { name: "Low", value: 14 }, { name: "OOS", value: 8 } ];
const donutColors = ["#16a34a", "#f59e0b", "#ef4444"];

const hourly = Array.from({ length: 24 }).map((_, i) => ({ h: `${i}:00`, avail: i < 10 ? 100 : i < 14 ? 65 : i < 18 ? 35 : 80 }));

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

const AvailabilityWatchtower: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState<Row | null>(null);

  const actionAndLog = (desc: string) => {
    toast({ title: "Action queued", description: desc });
    navigate("/alerts-action-log");
  };

  return (
    <>
      <Helmet>
        <title>Availability & OOS watchtower — Synapse</title>
        <meta name="description" content="Visibility into stock status to avoid wasted spend and coordinate ops." />
        <link rel="canonical" href="/availability-watchtower" />
      </Helmet>
      <DashboardLayout title="Availability & OOS watchtower" subtitle="Don’t spend on thin air.">
        {/* KPI belt */}
        <section className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2 sm:gap-4">
          {kpis.map((k) => (
            <Card key={k.key} className="rounded-xl">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal"><InfoLabel label={k.key} tip={k.tip} /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{k.value}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Row 2 */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          <div className="lg:col-span-8">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2 flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-sm">City × SKU</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => actionAndLog("Notify all: risky rows")}>Notify all</Button>
                  <Button size="sm" variant="outline" onClick={() => actionAndLog("Allow substitution for all risky rows")}>Allow substitution for all</Button>
                  <Button size="sm" variant="outline">Export CSV</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>City</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Platforms</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead><InfoLabel label="Avail%" tip={tooltipCopy.avail} /></TableHead>
                        <TableHead>Next replenishment</TableHead>
                        <TableHead>OOS risk (24h)</TableHead>
                        <TableHead>Ads state</TableHead>
                        <TableHead className="text-right">Spend 7d</TableHead>
                        <TableHead className="text-right"><InfoLabel label="Lost sales est. (7d)" tip={tooltipCopy.lost} /></TableHead>
                        <TableHead>Substitution</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map((r, i) => (
                        <TableRow key={i} className="cursor-pointer" onClick={() => setSelected(r)}>
                          <TableCell className="font-medium">{r.city}</TableCell>
                          <TableCell>{r.sku}</TableCell>
                          <TableCell>{r.platforms_live.join(', ')}</TableCell>
                          <TableCell className={r.stock_state === 'OOS' ? 'text-destructive' : r.stock_state === 'Low' ? 'text-amber-600' : ''}>{r.stock_state}</TableCell>
                          <TableCell>{r.availability_pct_24h}%</TableCell>
                          <TableCell>{r.next_eta === '-' ? '-' : new Date(r.next_eta).toLocaleString()}</TableCell>
                          <TableCell className={r.oos_risk_24h > 0.5 ? 'text-destructive' : r.oos_risk_24h > 0.3 ? 'text-amber-600' : 'text-muted-foreground'}>{Math.round(r.oos_risk_24h * 100)}%</TableCell>
                          <TableCell>{r.ads_state}</TableCell>
                          <TableCell className="text-right">₹{Math.round(r.spend_7d/1000)}k</TableCell>
                          <TableCell className="text-right">₹{Math.round(r.lost_sales_7d/1000)}k</TableCell>
                          <TableCell className="text-xs">{r.substitution.primary} → {r.substitution.backup1 || '—'}{r.substitution.backup2 ? `/${r.substitution.backup2}` : ''}</TableCell>
                          <TableCell className="space-x-2" onClick={(e) => e.stopPropagation()}>
                            <Button size="sm" variant="secondary" onClick={() => actionAndLog(`Notify replenishment: ${r.city} · ${r.sku}`)}>Notify replenishment</Button>
                            <Button size="sm" variant="outline" onClick={() => actionAndLog(`Allow substitution: ${r.city} · ${r.sku}`)}>Allow substitution</Button>
                            <Button size="sm" onClick={() => actionAndLog(`Lift hold after positive checks: ${r.city} · ${r.sku}`)}>Lift hold</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Gauges & risks</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="h-36">
                  <ChartContainer config={{}} className="h-full">
                    <PieChart>
                      <Pie data={donut} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60}>
                        {donut.map((_, i) => (
                          <Cell key={i} fill={donutColors[i % donutColors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Top 5 risky cities</div>
                  <ul className="text-sm space-y-1">
                    {[{city:'Mumbai', risk:62, spend:'₹84k'},{city:'Pune', risk:41, spend:'₹41k'},{city:'Hyderabad', risk:35, spend:'₹33k'}].map((c)=> (
                      <li key={c.city} className="flex items-center justify-between"><span>{c.city}</span><span className="text-muted-foreground">{c.risk}% — {c.spend}</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Top 5 risky SKUs</div>
                  <ul className="text-sm space-y-1">
                    {[{sku:'Veg Nuggets 500g', risk:62},{sku:'Fries 750g', risk:41},{sku:'Aloo Tikki 500g', risk:28}].map((s)=> (
                      <li key={s.sku} className="flex items-center justify-between"><span>{s.sku}</span><span className="text-muted-foreground">{s.risk}%</span></li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Row 3: Root-cause + Action queue */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Root-cause panel</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex flex-wrap gap-2">
                {['Demand spike','Store outage','Late replenishment','Data gap'].map((t) => (
                  <span key={t} className="px-2 py-1 rounded-md bg-muted/60">{t}</span>
                ))}
              </div>
              <div className="text-xs text-muted-foreground">Detection cadence: every 15 min; auto-pause on OOS; resume after 2 consecutive positive checks.</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Action queue</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              {[
                'Paused Zepto ad groups for Veg Nuggets 500g · Mumbai',
                'Notified replenishment · Pune Fries 750g (ETA 6pm)',
                'Allowed substitution Fries→Wedges · Instamart Pune'
              ].map((a, i) => (
                <div key={i} className="rounded-md border p-2">{a}</div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Drawer for row details */}
        <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DrawerContent>
            {selected && (
              <>
                 <DrawerHeader>
                  <DrawerTitle>{selected.sku} — {selected.city}</DrawerTitle>
                  <DrawerDescription>Hourly availability, paused campaigns, and cause.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-2 grid gap-3 text-sm">
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Hourly availability (24h)</div>
                    <div className="h-32">
                      <ResponsiveContainer>
                        <LineChart data={hourly} margin={{ left: 6, right: 6, top: 4, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="h" hide />
                          <YAxis hide />
                          <Line type="monotone" dataKey="avail" stroke="#16a34a" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Paused campaigns</div>
                     <ul className="list-disc pl-4 space-y-1">
                      <li>{selected.platforms_live.join(', ')} — Prospecting — City={selected.city}</li>
                      <li>{selected.platforms_live[0]} — Retargeting — SKU={selected.sku}</li>
                    </ul>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Competitor shelf presence</div>
                    <div className="text-muted-foreground">Blinkit: Present — Zepto: Missing</div>
                  </div>
                </div>
                <DrawerFooter>
                    <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={() => actionAndLog(`Unpause until ETA for ${selected.city} — ${selected.sku}`)}>Unpause until ETA</Button>
                    <Button size="sm" variant="outline" onClick={() => actionAndLog(`Route to backup only for ${selected.city} — ${selected.sku}`)}>Route to backup only</Button>
                    <Button size="sm" variant="destructive" onClick={() => actionAndLog(`Raise incident for ${selected.city} — ${selected.sku}`)}>Raise incident</Button>
                  </div>
                </DrawerFooter>
              </>
            )}
          </DrawerContent>
        </Drawer>
      </DashboardLayout>
    </>
  );
};

export default AvailabilityWatchtower;


