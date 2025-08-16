import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, ScatterChart, Scatter } from "recharts";
import { Info } from "lucide-react";

type QA = {
  sku: string;
  platform: "Blinkit" | "Zepto" | "Instamart" | "Amazon" | "Flipkart";
  images: number;
  titleLen: number; // chars
  titleHasKeyword: boolean;
  bullets: number;
  video: boolean;
  nutrition: boolean;
  compliance: boolean;
  ratingsCount: number;
  ratingsAvg: number;
  parityFlag: boolean; // true if overpriced vs rival
  freshnessDays: number;
  score: number; // 0-100
};

const tooltipCopy = {
  score: "Weighted score (0–100) from images, title, bullets, video, nutrition, compliance, ratings, parity.",
  redFlag: "Fails a blocker check (e.g., <2 images, missing compliance, empty title). Ads should be held.",
  atRisk: "Non-blocker gaps likely hurting CVR (e.g., no video, short bullets).",
  freshness: "Days since last asset update. >90 days marked stale.",
  parity: "Our price vs lowest rival in same city; >+5% prompts a warning.",
  ratings: "Signal of social proof; <20 reviews often depress CVR.",
};

const rows: QA[] = [
  { sku: "Aloo Tikki 500g", platform: "Blinkit", images: 5, titleLen: 62, titleHasKeyword: true, bullets: 6, video: true, nutrition: true, compliance: true, ratingsCount: 124, ratingsAvg: 4.3, parityFlag: false, freshnessDays: 21, score: 88 },
  { sku: "Veg Nuggets 500g", platform: "Zepto", images: 3, titleLen: 48, titleHasKeyword: false, bullets: 4, video: false, nutrition: true, compliance: true, ratingsCount: 18, ratingsAvg: 4.0, parityFlag: true, freshnessDays: 97, score: 68 },
  { sku: "Fries 750g", platform: "Instamart", images: 1, titleLen: 32, titleHasKeyword: false, bullets: 2, video: false, nutrition: true, compliance: false, ratingsCount: 9, ratingsAvg: 3.6, parityFlag: false, freshnessDays: 120, score: 52 },
];

const kpis = [
  { key: "Overall content health", value: "82%" },
  { key: "Red-flag SKUs (blockers)", value: 3 },
  { key: "At-risk SKUs (warnings)", value: 6 },
  { key: "Avg images / SKU", value: 4.2 },
  { key: "PDPs with video", value: "41%" },
  { key: "Nutrition present", value: "67%" },
  { key: "Median content age", value: "43 days" },
  { key: "Median fix SLA", value: "2.3 days" },
];

const platformPass = [
  { name: "Blinkit", pass: 86 },
  { name: "Zepto", pass: 72 },
  { name: "Instamart", pass: 69 },
  { name: "Amazon", pass: 78 },
  { name: "Flipkart", pass: 74 },
];

const cityChecks = ["Images","Title","Video","Nutrition"];
const cityHeat = [
  { city: "Mumbai", Images: 0.88, Title: 0.76, Video: 0.42, Nutrition: 0.61 },
  { city: "Delhi", Images: 0.82, Title: 0.69, Video: 0.39, Nutrition: 0.66 },
  { city: "Bengaluru", Images: 0.85, Title: 0.72, Video: 0.44, Nutrition: 0.63 },
];

const effectScatter = Array.from({ length: 30 }).map((_, i) => ({ score: 40 + i * 2, roas: 3 + Math.min(3, i * 0.12), spend: 10 + i }));
const beforeAfterCVR = [
  { sku: "Aloo Tikki 500g", before: 2.4, after: 2.9 },
  { sku: "Veg Nuggets 500g", before: 2.1, after: 2.4 },
  { sku: "Fries 750g", before: 1.8, after: 2.1 },
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

const ListingQA: React.FC = () => {
  const [selected, setSelected] = React.useState<QA | null>(null);

  return (
    <>
      <Helmet>
        <title>Listing content QA & readiness — Synapse</title>
        <meta name="description" content="Ensure PDPs meet content standards before paid activation." />
        <link rel="canonical" href="/listing-qa" />
      </Helmet>
      <DashboardLayout title="Listing content QA & readiness" subtitle="No broken PDPs on paid.">
        {/* Row 1: KPI belt */}
        <section className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-4">
          {kpis.map((k) => (
            <Card key={k.key} className="rounded-xl">
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground font-normal"><InfoLabel label={k.key} /></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">{k.value}</div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Row 2: Checks table + Content health panel */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2 flex-row items-center justify-between">
                <CardTitle className="text-sm">Checks</CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">Export CSV</Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto rounded-lg border bg-card p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Images</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Bullets</TableHead>
                      <TableHead>Video</TableHead>
                      <TableHead>Nutrition</TableHead>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Ratings</TableHead>
                      <TableHead>Parity</TableHead>
                      <TableHead>Freshness</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((r) => (
                      <TableRow key={`${r.sku}-${r.platform}`} className="cursor-pointer hover:bg-muted/50 transition-colors duration-200" onClick={() => setSelected(r)}>
                        <TableCell className="font-medium">{r.sku}</TableCell>
                        <TableCell>{r.platform}</TableCell>
                        <TableCell className={r.images < 2 ? "text-destructive" : r.images < 4 ? "text-amber-600" : ""}>{r.images}</TableCell>
                        <TableCell className={r.titleLen < 30 ? "text-destructive" : r.titleLen < 50 ? "text-amber-600" : ""}>{r.titleLen}</TableCell>
                        <TableCell>{r.titleHasKeyword ? "✓" : "✗"}</TableCell>
                        <TableCell className={r.bullets < 3 ? "text-destructive" : r.bullets < 5 ? "text-amber-600" : ""}>{r.bullets}</TableCell>
                        <TableCell>{r.video ? "✓" : "✗"}</TableCell>
                        <TableCell>{r.nutrition ? "✓" : "✗"}</TableCell>
                        <TableCell className={!r.compliance ? "text-destructive" : ""}>{r.compliance ? "✓" : "✗"}</TableCell>
                        <TableCell className={r.ratingsCount < 20 ? "text-amber-600" : ""}>{r.ratingsCount}</TableCell>
                        <TableCell>{r.ratingsAvg.toFixed(1)}</TableCell>
                        <TableCell className={r.parityFlag ? "text-destructive" : ""}>{r.parityFlag ? "✗" : "✓"}</TableCell>
                        <TableCell className={r.freshnessDays > 90 ? "text-amber-600" : ""}>{r.freshnessDays}</TableCell>
                        <TableCell className={r.score < 60 ? "text-destructive" : r.score < 80 ? "text-amber-600" : "text-emerald-600"}>{r.score}</TableCell>
                        <TableCell className="space-x-2" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="secondary" className="hover:bg-secondary/80 transition-colors duration-200 border-2 border-green-500">Push updated assets</Button>
                          <Button size="sm" variant="outline" className="hover:bg-muted transition-colors duration-200 border-2 border-green-500">Raise ticket</Button>
                          <Button size="sm" variant="destructive" className="hover:bg-destructive/90 transition-colors duration-200 border-2 border-green-500">Hold ads</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2"><CardTitle className="text-sm">Content health</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Red flags (blockers)</div>
                   <ul className="space-y-1">
                    {rows.filter(r => !r.compliance || r.images < 2 || r.titleLen === 0).slice(0,3).map((r) => (
                      <li key={r.sku + r.platform} className="flex items-center justify-between">
                        <span>{r.sku} — {r.platform}</span>
                        <span className="text-destructive text-xs">Blocker</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Warnings (prioritized)</div>
                  <ul className="space-y-1">
                     {rows.filter(r => r.compliance && (r.images < 4 || !r.video || r.bullets < 5)).slice(0,5).map((r) => (
                      <li key={r.sku + r.platform} className="flex items-center justify-between">
                        <span>{r.sku} — {r.platform}</span>
                        <span className="text-amber-600 text-xs">Impact: ↑CVR with fixes</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive">Hold ads (blockers)</Button>
                  <Button size="sm" variant="secondary">Send fix pack</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Row 3: Coverage charts + Effect of fixes */}
        <section className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Platform coverage</CardTitle></CardHeader>
            <CardContent className="h-56">
              <ResponsiveContainer>
                <BarChart data={platformPass} margin={{ left: 6, right: 6 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RTooltip />
                  <Bar dataKey="pass" fill="#16a34a" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Effect of fixes (before/after CVR)</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="text-xs text-muted-foreground">Median uplift ~ +8% (IQR)</div>
              <div className="h-56">
                <ResponsiveContainer>
                  <BarChart data={beforeAfterCVR} margin={{ left: 6, right: 6 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="sku" hide />
                    <YAxis />
                    <RTooltip />
                    <Bar dataKey="before" fill="#94a3b8" name="Before" />
                    <Bar dataKey="after" fill="#4f46e5" name="After" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Row 3.5: Score vs ROAS scatter (payoff of fixing content) */}
        <section>
          <Card className="rounded-2xl">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Content score vs ROAS</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer>
                <ScatterChart margin={{ left: 6, right: 6, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="score" name="Score" />
                  <YAxis dataKey="roas" name="ROAS" />
                  <RTooltip />
                  <Scatter data={effectScatter} fill="#06b6d4" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Drawer: Row click details */}
        <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DrawerContent>
            {selected && (
              <>
                 <DrawerHeader>
                  <DrawerTitle>{selected.sku} — {selected.platform}</DrawerTitle>
                  <DrawerDescription>Why score = {selected.score}. Recommended fixes and estimated impact below.</DrawerDescription>
                </DrawerHeader>
                <div className="px-4 pb-2 grid gap-3 text-sm">
                  <div className="rounded-md border p-3 bg-muted/40">
                    <div className="text-xs text-muted-foreground mb-1">PDP preview</div>
                    <div className="h-36 bg-muted flex items-center justify-center">
                      <img src="/placeholder.svg" alt="pdp" className="h-24" />
                    </div>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Why score</div>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Images {selected.images}/≥4</li>
                      <li>Title {selected.titleLen} chars {selected.titleHasKeyword ? "(keyword ok)" : "(keyword missing)"}</li>
                      <li>Bullets {selected.bullets}/≥5</li>
                      <li>Video {selected.video ? "present" : "missing"}</li>
                      <li>Nutrition {selected.nutrition ? "present" : "missing"} — Compliance {selected.compliance ? "ok" : "missing (blocker)"}</li>
                      <li>Ratings {selected.ratingsCount} @ {selected.ratingsAvg.toFixed(1)} — Parity {selected.parityFlag ? ">+5%" : "ok"}</li>
                    </ul>
                  </div>
                  <div className="rounded-md border p-3">
                    <div className="text-xs text-muted-foreground mb-1">Impact estimate</div>
                    <div>Fixing <strong>Video +1</strong> and <strong>Bullets +2</strong> likely ↑ CVR <strong>+6–10%</strong> (based on brand curves).</div>
                  </div>
                </div>
                <DrawerFooter>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" className="hover:bg-secondary/80 transition-colors duration-200 border-2 border-green-500">Push assets</Button>
                    <Button size="sm" variant="outline" className="hover:bg-muted transition-colors duration-200 border-2 border-green-500">Create Jira</Button>
                    <Button size="sm" variant="destructive" className="hover:bg-destructive/90 transition-colors duration-200 border-2 border-green-500">Hold ads</Button>
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

export default ListingQA;


