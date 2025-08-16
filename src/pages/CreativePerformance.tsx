import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, ScatterChart, Scatter, BarChart, Bar, ResponsiveContainer } from "recharts";
import { Info, Sparkles } from "lucide-react";

type Creative = {
  id: string;
  platform: "Blinkit" | "Zepto" | "Instamart";
  variant: string;
  ctr: number;
  cvr: number;
  roas: number;
  cpc: number;
  cpm: number;
  serveShare: number;
  ageDays: number;
  imprToFatigue: number;
  lastRefreshedDays: number;
  fatigueRisk: "Low" | "Med" | "High";
  bestSlot: string;
  bestSlotRoas: number;
  bestSlotDelta: number;
};

const tooltipCopy = {
  CTR: "Clicks ÷ Impressions (period).",
  CVR: "Orders ÷ Clicks.",
  ROAS: "Revenue attributed ÷ Ad spend (same-day, last-click unless changed).",
  CPC: "Cost per click.",
  CPM: "Cost per 1,000 impressions.",
  share: "Share of impressions this creative received among its siblings.",
  age: "Days since first served.",
  imprFatigue: "Remaining impressions before CTR is predicted to drop 35% vs its 3-day average (based on decay model).",
  fatigue: "Low/Med/High determined by CTR decay, frequency > cap, or novelty decay.",
  exploration: "% of traffic reserved for testing new/under-served variants.",
  bestSlot: "Daypart where this creative has the highest ROAS in the filtered scope.",
  bandit: "Allocation chosen by Thompson Sampling balancing exploration and exploitation.",
};

const creatives: Creative[] = [
  { id: "C-001", platform: "Blinkit", variant: "V1", ctr: 1.4, cvr: 3.1, roas: 6.2, cpc: 9.5, cpm: 120, serveShare: 32, ageDays: 12, imprToFatigue: 45000, lastRefreshedDays: 3, fatigueRisk: "Med", bestSlot: "Snacks 16–19h", bestSlotRoas: 6.2, bestSlotDelta: 0.8 },
  { id: "C-002", platform: "Zepto", variant: "V3", ctr: 0.9, cvr: 2.4, roas: 4.1, cpc: 12.1, cpm: 150, serveShare: 18, ageDays: 21, imprToFatigue: 15000, lastRefreshedDays: 9, fatigueRisk: "High", bestSlot: "Late 20–23h", bestSlotRoas: 4.9, bestSlotDelta: 0.6 },
  { id: "C-003", platform: "Instamart", variant: "V2", ctr: 1.7, cvr: 3.4, roas: 6.8, cpc: 8.8, cpm: 110, serveShare: 25, ageDays: 8, imprToFatigue: 90000, lastRefreshedDays: 2, fatigueRisk: "Low", bestSlot: "Snacks 16–19h", bestSlotRoas: 6.5, bestSlotDelta: 0.5 },
  { id: "C-004", platform: "Blinkit", variant: "V2", ctr: 1.1, cvr: 2.6, roas: 4.7, cpc: 10.4, cpm: 130, serveShare: 12, ageDays: 15, imprToFatigue: 30000, lastRefreshedDays: 5, fatigueRisk: "Med", bestSlot: "Lunch 12–15h", bestSlotRoas: 5.2, bestSlotDelta: 0.4 },
];

const kpis = [
  { key: "Active creatives", value: 27 },
  { key: "Spend share on Top-5", value: "62%" },
  { key: "Revenue share on Top-5", value: "71%" },
  { key: "Avg CTR (7d)", value: "1.26%", tip: tooltipCopy.CTR },
  { key: "Avg CVR (7d)", value: "2.9%", tip: tooltipCopy.CVR },
  { key: "Avg ROAS (7d)", value: "5.0x", tip: tooltipCopy.ROAS },
  { key: "At fatigue risk", value: "6 (22%)", tip: tooltipCopy.fatigue },
  { key: "Median creative age", value: "9 days", tip: tooltipCopy.age },
];

const sparkData = Array.from({ length: 7 }).map((_, i) => ({ day: `D${i + 1}`, ctr: [1.0,1.2,0.9,1.1,1.3,1.25,1.26][i], cvr: [2.6,2.7,2.8,2.9,3.0,3.1,2.9][i], roas: [4.8,5.1,4.9,5.3,5.5,5.2,5.0][i] }));
const freqScatter = Array.from({ length: 20 }).map((_, i) => ({ f: 1 + i * 0.2, ctr: 1.6 - i * 0.03 }));

const platformWeights: Record<Creative["platform"], { name: string; value: number }[]> = {
  Blinkit: [ { name: "V1", value: 40 }, { name: "V2", value: 35 }, { name: "V3", value: 25 } ],
  Zepto: [ { name: "V1", value: 50 }, { name: "V2", value: 20 }, { name: "V3", value: 30 } ],
  Instamart: [ { name: "V1", value: 30 }, { name: "V2", value: 40 }, { name: "V3", value: 30 } ],
};

const dayparts = ["0–5h","6–9h","10–13h","14–17h","18–21h","22–23h"];
const heatmap = creatives.slice(0, 3).map((c) => ({
  creative: `${c.platform} · ${c.variant}`,
  cells: dayparts.map((d, i) => ({
    daypart: d,
    roas: Number((c.roas + (i % 3 === 0 ? 0.8 : -0.3)).toFixed(1)),
    delta: (i % 2 === 0 ? +0.4 : -0.2),
    significant: i % 3 === 0,
  })),
}));

const pieColors = ["#4f46e5", "#06b6d4", "#16a34a", "#f59e0b"]; 

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

const ConfirmAction: React.FC<{ trigger: React.ReactNode; text: string; onConfirm: () => void }> = ({ trigger, text, onConfirm }) => (
  <Dialog>
    <DialogTrigger asChild>{trigger}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm change</DialogTitle>
        <DialogDescription>{text}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline">Cancel</Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const CreativePerformance: React.FC = () => {
  const { toast } = (useToast as any)();
  const navigate = useNavigate();
  const cardRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const handleGoToCard = (id: string) => {
    const el = cardRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const onActionConfirmed = (desc: string) => {
    toast({ title: "Action queued", description: desc });
    navigate("/alerts-action-log");
  };

  return (
    <>
      <Helmet>
        <title>Creative performance & fatigue — Synapse</title>
        <meta name="description" content="Understand which assets drive performance and which need refresh." />
        <link rel="canonical" href="/creative-performance" />
      </Helmet>
      <DashboardLayout title="Creative performance & fatigue" subtitle="Which assets to scale, refresh, or retire.">
        {/* Row 1: KPI belt */}
        <section className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
          {kpis.map((k) => (
            <Card key={k.key} className="rounded-xl">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal">
                  <InfoLabel label={k.key} tip={k.tip} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{k.value}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Row 2: Creative grid + Diagnostics */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 grid gap-4 sm:grid-cols-2">
            {creatives.map((c) => (
              <div key={c.id} ref={(el) => (cardRefs.current[c.id] = el)} className="bg-card rounded-2xl border overflow-hidden">
                <div className="h-28 bg-muted flex items-center justify-center">
                  <img src="/placeholder.svg" alt="thumb" className="h-16" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm">{c.platform} — {c.variant}</div>
                    <span className="text-xs text-muted-foreground">Age {c.ageDays}d</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
                    <InfoLabel label={`CTR ${c.ctr.toFixed(2)}%`} tip={tooltipCopy.CTR} />
                    <InfoLabel label={`CVR ${c.cvr.toFixed(1)}%`} tip={tooltipCopy.CVR} />
                    <InfoLabel label={`ROAS ${c.roas.toFixed(1)}×`} tip={tooltipCopy.ROAS} />
                    <InfoLabel label={`CPC ₹${c.cpc.toFixed(1)}`} tip={tooltipCopy.CPC} />
                    <InfoLabel label={`CPM ₹${c.cpm.toFixed(0)}`} tip={tooltipCopy.CPM} />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="inline-flex items-center gap-2">
                      <InfoLabel label={`Serve ${c.serveShare}%`} tip={tooltipCopy.share} />
                      <InfoLabel label={`Impr→fatigue ${c.imprToFatigue.toLocaleString()}`} tip={tooltipCopy.imprFatigue} />
                    </div>
                    <div className={`px-2 py-0.5 rounded-md ${c.fatigueRisk === "High" ? "bg-red-100 text-red-700" : c.fatigueRisk === "Med" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      <InfoLabel label={`Risk ${c.fatigueRisk}`} tip={tooltipCopy.fatigue} />
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Last refreshed {c.lastRefreshedDays}d ago</div>
                  <div className="text-xs">Best slot: <span className="font-medium">{c.bestSlot}</span>, ROAS {c.bestSlotRoas.toFixed(1)}× ({c.bestSlotDelta > 0 ? "+" : ""}{c.bestSlotDelta.toFixed(1)}× vs avg)</div>
                  <div className="flex flex-wrap gap-2">
                    <ConfirmAction
                      trigger={<Button size="sm" variant="secondary" className="hover:bg-secondary/80 transition-colors duration-200 border-2 border-green-500">Refresh variants</Button>}
                      text={`Refresh ${c.variant} from ${c.platform}; exploration 10%.`}
                      onConfirm={() => onActionConfirmed(`${c.platform} · ${c.variant}: Refresh`)}
                    />
                    <ConfirmAction
                      trigger={<Button size="sm" variant="outline" className="hover:bg-muted transition-colors duration-200 border-2 border-green-500">Swap headline</Button>}
                      text={`Swap headline on ${c.platform} · ${c.variant}; expected CTR +8–12%.`}
                      onConfirm={() => onActionConfirmed(`${c.platform} · ${c.variant}: Swap headline`)}
                    />
                    <ConfirmAction
                      trigger={<Button size="sm" variant="outline" className="hover:bg-muted transition-colors duration-200 border-2 border-green-500">Duplicate to other</Button>}
                      text={`Duplicate ${c.variant} from ${c.platform} to siblings; exploration 10%.`}
                      onConfirm={() => onActionConfirmed(`${c.platform} · ${c.variant}: Duplicate`)}
                    />
                    <ConfirmAction
                      trigger={<Button size="sm" variant="outline" className="hover:bg-muted transition-colors duration-200 border-2 border-green-500">Start A/B</Button>}
                      text={`Start A/B for ${c.platform} · ${c.variant}; stop when p<0.05.`}
                      onConfirm={() => onActionConfirmed(`${c.platform} · ${c.variant}: Start A/B`)}
                    />
                    <ConfirmAction
                      trigger={<Button size="sm" variant="destructive" className="hover:bg-destructive/90 transition-colors duration-200 border-2 border-green-500">Pause</Button>}
                      text={`Pause ${c.platform} · ${c.variant}; will auto-resume if competitor CPM spikes.`}
                      onConfirm={() => onActionConfirmed(`${c.platform} · ${c.variant}: Pause`)}
                    />
                  </div>
                   <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Sparkles size={12} /> Best slot is based on daypart × creative performance.</div>
                  <div className="text-[11px] text-muted-foreground">Fatigue rule: If CTR ↓ ≥35% vs 3-day MA and Impr ≥ 60k → Amber; ≥50% → Red; throttle serve −20%.</div>
                </div>
              </div>
            ))}
          </div>
          {/* Diagnostics */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Diagnostics</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">CTR, CVR, ROAS (7d)</div>
                  <div className="h-28">
                    <ResponsiveContainer>
                      <LineChart data={sparkData} margin={{ left: 6, right: 6, top: 4, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" hide />
                        <YAxis hide />
                        <Line type="monotone" dataKey="ctr" stroke="#06b6d4" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="cvr" stroke="#16a34a" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="roas" stroke="#4f46e5" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Frequency vs CTR</div>
                  <div className="h-28">
                    <ResponsiveContainer>
                      <ScatterChart margin={{ left: 6, right: 6, top: 4, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="f" name="Freq" unit="x" />
                        <YAxis dataKey="ctr" name="CTR" unit="%" />
                        <Scatter data={freqScatter} fill="#8884d8" />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Copy/visual drivers</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {["snacks","evening","family","green","offer","contrast"].map((t) => (
                      <span key={t} className="px-2 py-1 rounded-md bg-muted/60">{t}</span>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">Exploration level ε=0.10 <InfoLabel label="" tip={tooltipCopy.exploration} /></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Row 3: Bandit share + Top lists */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Multi-arm bandit share (per platform)</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(platformWeights).map(([platform, weights]) => (
                <div key={platform} className="space-y-1">
                  <div className="text-xs text-muted-foreground">{platform}</div>
                  <ChartContainer config={{}} className="h-40">
                    <PieChart>
                      <Pie data={weights} dataKey="value" nameKey="name" innerRadius={30} outerRadius={48}>
                        {weights.map((_, i) => (
                          <Cell key={i} fill={pieColors[i % pieColors.length]} />
                        ))}
                      </Pie>
                      <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                  </ChartContainer>
                  <div className="text-[11px] text-muted-foreground">Auto-tuned hourly by Thompson Sampling; exploration 10%.</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Top creatives</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-xs text-muted-foreground mb-2">By ROAS</div>
                <ul className="space-y-2">
                  {creatives.slice().sort((a,b)=>b.roas - a.roas).slice(0,5).map((i) => (
                    <li key={i.id} className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors duration-200" onClick={() => handleGoToCard(i.id)}>
                      <span className="text-muted-foreground">{i.platform} — {i.variant}</span>
                      <span className="font-medium">{i.roas.toFixed(1)}×</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-2">By CTR</div>
                <ul className="space-y-2">
                  {creatives.slice().sort((a,b)=>b.ctr - a.ctr).slice(0,5).map((i) => (
                    <li key={i.id} className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded px-2 py-1 transition-colors duration-200" onClick={() => handleGoToCard(i.id)}>
                      <span className="text-muted-foreground">{i.platform} — {i.variant}</span>
                      <span className="font-medium">{i.ctr.toFixed(2)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Row 4: Heatmap + backlog (optional backlog omitted for brevity) */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Daypart × Creative heatmap</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr>
                      <th className="text-left px-2 py-1">Creative</th>
                      {dayparts.map((d) => (
                        <th key={d} className="px-2 py-1 text-center">{d}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {heatmap.map((row) => (
                      <tr key={row.creative}>
                        <td className="px-2 py-1 whitespace-nowrap text-muted-foreground">{row.creative}</td>
                        {row.cells.map((cell, ci) => {
                          const intensity = Math.max(0, Math.min(1, (cell.roas - 3) / 4));
                          const bg = `rgba(16, 185, 129, ${0.15 + intensity * 0.5})`;
                          return (
                            <td key={ci} className="px-1 py-1 text-center align-middle">
                              <div
                                className={`rounded-md border text-[11px] ${cell.significant ? 'border-dashed' : ''}`}
                                style={{ backgroundColor: bg }}
                                title={`ROAS ${cell.roas}× (Δ ${cell.delta > 0 ? '+' : ''}${cell.delta.toFixed(1)}×)`}
                              >
                                <div className="px-2 py-1">{cell.roas}× <span className={`ml-1 ${cell.delta>=0? 'text-emerald-700':'text-red-600'}`}>({cell.delta>0?'+':''}{cell.delta.toFixed(1)}×)</span></div>
                              </div>
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
          <div className="hidden md:block" />
        </section>
      </DashboardLayout>
    </>
  );
};

export default CreativePerformance;


