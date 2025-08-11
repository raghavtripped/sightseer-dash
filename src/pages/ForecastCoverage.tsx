import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Area, AreaChart, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from "recharts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Info } from "lucide-react";

const trend = Array.from({ length: 14 }).map((_, i) => ({ day: `D${i + 1}`, demand: 100 + i * 6 + (i % 4 === 0 ? 12 : -4), lo: 90 + i * 5, hi: 115 + i * 7 }))

const kpis = [
  { key: "Forecast (14d)", value: "₹2.86Cr", tip: "Projected demand from time-series + exogenous signals (weather, events); CI = 80%." },
  { key: "Peak day", value: "D+10 (₹25.4L)", tip: "Highest forecasted demand point within the horizon." },
  { key: "Peak daypart", value: "Snacks 16–19h (₹8.2L/day)", tip: "Highest forecasted demand point within the horizon." },
  { key: "Coverage index", value: "82/100", tip: "0–100 composite: dark-store presence, days of cover, and lead-time." },
  { key: "Projected OOS incidents", value: "9", tip: "Expected number of stockouts given current stock vs forecast." },
  { key: "Stock sufficiency", value: "11.5 days", tip: "Median days of cover across SKUs (units on hand ÷ daily demand)." },
  { key: "High-risk cities", value: "3" },
  { key: "Weather/event lifts", value: "+6%", tip: "Net % impact applied from calibrated effects." },
];

const cityCoverage = [
  { city: "Delhi", forecast: 12.4, coverage: 0.93, risk: "Low", darkstores: "9/10", lead: 12 },
  { city: "Mumbai", forecast: 10.1, coverage: 0.78, risk: "Medium", darkstores: "8/10", lead: 18 },
  { city: "Bengaluru", forecast: 9.5, coverage: 0.88, risk: "Low", darkstores: "9/10", lead: 10 },
  { city: "Pune", forecast: 7.2, coverage: 0.67, risk: "High", darkstores: "7/10", lead: 20 },
]

const daypartBands = [
  { start: 0, end: 3, label: "Breakfast" },
  { start: 4, end: 7, label: "Lunch" },
  { start: 8, end: 11, label: "Snacks" },
  { start: 12, end: 13, label: "Dinner" },
];

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

const ForecastCoverage: React.FC = () => {
  const { toast } = (useToast as any)();
  const [selected, setSelected] = React.useState<typeof cityCoverage[number] | null>(null);
  const [whatIf, setWhatIf] = React.useState({ spend: 0, price: 0, inventory: 0, exploration: 10 });

  // Simple live projections
  const deltaConv = (whatIf.spend * 0.5) - (whatIf.price * 0.3) + (whatIf.inventory * 0.2);
  const deltaSales = deltaConv * 1.6;
  const deltaROAS = whatIf.spend > 0 ? +0.2 : -0.1;
  const projectedOOS = Math.max(0, 9 - Math.floor(whatIf.inventory / 10));

  return (
    <>
      <Helmet>
        <title>Forecast & Coverage – Synapse</title>
        <meta name="description" content="Demand forecasts and coverage planning by city and daypart." />
        <link rel="canonical" href="/forecast-coverage" />
      </Helmet>
      <DashboardLayout title="Forecast & Coverage" subtitle="Forecast demand by city & daypart, check coverage, and act early.">
        {/* Row 1: KPI belt */}
        <section className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
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

        {/* Row 2: Forecast chart + Coverage */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Forecast (14 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer>
                    <AreaChart data={trend} margin={{ left: 6, right: 6 }}>
                      <CartesianGrid vertical={false} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      {/* CI band */}
                      <Area type="monotone" dataKey="hi" stroke="transparent" fill="#93c5fd55" />
                      <Area type="monotone" dataKey="lo" stroke="transparent" fill="#93c5fd55" />
                      <Line type="monotone" dataKey="demand" stroke="#4f46e5" strokeWidth={2} dot={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-2 text-[11px] text-muted-foreground mt-2">
                  {daypartBands.map((b) => (
                    <span key={b.label} className="px-2 py-0.5 rounded-md bg-muted/60">{b.label}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Coverage cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {cityCoverage.map((r) => (
                    <div key={r.city} className="rounded-md border p-3 cursor-pointer" onClick={() => setSelected(r)}>
                      <div className="text-sm font-medium">{r.city}</div>
                      <div className="text-xs text-muted-foreground">Dark stores: {r.darkstores} · Coverage {Math.round(r.coverage*100)}% · Risk {r.risk} · Lead-time {r.lead}h</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Row 3: What-if simulator + Actions */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">What-if simulator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid sm:grid-cols-4 gap-3 text-sm">
                  <label className="flex flex-col">Ad spend ±%<input type="range" min={-20} max={20} value={whatIf.spend} onChange={(e)=>setWhatIf({ ...whatIf, spend: Number(e.target.value) })} /></label>
                  <label className="flex flex-col">Price ±%<input type="range" min={-10} max={10} value={whatIf.price} onChange={(e)=>setWhatIf({ ...whatIf, price: Number(e.target.value) })} /></label>
                  <label className="flex flex-col">Inventory +units<input type="range" min={0} max={100} value={whatIf.inventory} onChange={(e)=>setWhatIf({ ...whatIf, inventory: Number(e.target.value) })} /></label>
                  <label className="flex flex-col">Exploration %<input type="range" min={0} max={20} value={whatIf.exploration} onChange={(e)=>setWhatIf({ ...whatIf, exploration: Number(e.target.value) })} /></label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[{k:'ΔConv', v: deltaConv.toFixed(0)},{k:'ΔSales', v: `₹${(deltaSales*10).toFixed(0)}k`},{k:'ΔROAS', v: `${deltaROAS>0?'+':''}${deltaROAS.toFixed(1)}x`},{k:'Projected OOS', v: projectedOOS}].map((c)=> (
                    <div key={c.k} className="rounded-md border p-3 text-sm"><div className="text-xs text-muted-foreground">{c.k}</div><div className="font-medium">{c.v}</div></div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => toast({ title: "Applied to plan", description: "Draft sent to Supply Chain" })}>Apply to plan</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-4">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Primary CTAs</CardTitle></CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => toast({ title: "Pre-position planned", description: "Suggesting units per city × SKU for 3–5 days" })}>Pre-position stock</Button>
                <Button variant="outline" onClick={() => toast({ title: "Guardrail set", description: "Throttle bids −20% when days-of-cover <2" })}>Throttle bids if projected OOS</Button>
                <Button onClick={() => toast({ title: "Backup mapping wizard", description: "Primary → Backup1/2 by city/daypart" })}>Create backup SKU mapping</Button>
                <Button variant="outline" onClick={() => toast({ title: "Plan sent", description: "CSV + Slack sent to Supply Chain" })}>Send plan to Supply Chain</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Row 4: City coverage table */}
        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">City coverage</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Forecast (L)</TableHead>
                    <TableHead className="text-right">Coverage%</TableHead>
                    <TableHead className="text-right">Days of cover</TableHead>
                    <TableHead>Dark stores online</TableHead>
                    <TableHead>Lead-time (hrs)</TableHead>
                    <TableHead>OOS risk</TableHead>
                    <TableHead>Guardrails breached?</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cityCoverage.map((r) => (
                    <TableRow key={r.city} onClick={() => setSelected(r)} className="cursor-pointer">
                      <TableCell className="font-medium">{r.city}</TableCell>
                      <TableCell className="text-right">{r.forecast.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{Math.round(r.coverage * 100)}%</TableCell>
                      <TableCell className="text-right">{(r.coverage * 2.5).toFixed(1)}</TableCell>
                      <TableCell>{r.darkstores}</TableCell>
                      <TableCell>{r.lead}h</TableCell>
                      <TableCell className={r.risk === 'High' ? 'text-destructive' : r.risk === 'Medium' ? 'text-amber-600' : 'text-success'}>{r.risk}</TableCell>
                      <TableCell className="text-muted-foreground">{r.risk !== 'Low' ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        {/* Drawer: city drill */}
        <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DrawerContent>
            {selected && (
              <>
                <DrawerHeader>
                  <DrawerTitle>{selected.city}</DrawerTitle>
                  <DrawerDescription>Daypart forecast, stock, and risks.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-2 grid gap-3 text-sm">
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Daypart forecast</div>
                    <div className="h-36">
                      <ResponsiveContainer>
                        <BarChart data={[{p:'Breakfast',v:12},{p:'Lunch',v:18},{p:'Snacks',v:25},{p:'Dinner',v:20}]}> 
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="p" />
                          <YAxis />
                          <Bar dataKey="v" fill="#4f46e5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Days of cover by SKU</div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Aloo Tikki 500g – 3.2 days</li>
                      <li>Veg Nuggets 500g – 1.9 days</li>
                      <li>Fries 750g – 2.4 days</li>
                    </ul>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Risk drivers</div>
                    <div className="text-muted-foreground">Lead-time {selected.lead}h · OOS rate elevated on weekends · Event: Payday</div>
                  </div>
                </div>
                <DrawerFooter>
                  <div className="flex gap-2">
                    <Button variant="secondary">Rebalance stock</Button>
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

export default ForecastCoverage;


