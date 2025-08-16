import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TestRow = { id: string; name: string; platform: string; kpi: string; lift: number; pvalue: number; status: "Running" | "Holdout" | "Completed" };

const running: TestRow[] = [
  { id: "T-101", name: "Zepto dinner headline", platform: "Zepto", kpi: "ROAS", lift: 12.4, pvalue: 0.03, status: "Running" },
  { id: "T-102", name: "Blinkit snacks bid +10%", platform: "Blinkit", kpi: "Conv", lift: 6.8, pvalue: 0.07, status: "Running" },
];

const PerfExperiments: React.FC = () => {
  const { toast } = useToast();
  return (
    <>
      <Helmet>
        <title>Experiments (A/B & holdouts) — Synapse</title>
        <meta name="description" content="Design, monitor, and archive experiments to prove incrementality." />
        <link rel="canonical" href="/experiments" />
      </Helmet>
      <DashboardLayout title="Experiments (A/B & holdouts)" subtitle="Prove incrementality. Iterate creatives and bids.">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Running tests</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Test</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>KPI</TableHead>
                    <TableHead className="text-right">Lift%</TableHead>
                    <TableHead className="text-right">p-value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {running.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/50 transition-colors duration-200">
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.platform}</TableCell>
                      <TableCell>{r.kpi}</TableCell>
                      <TableCell className="text-right">{r.lift.toFixed(1)}%</TableCell>
                      <TableCell className={"text-right " + (r.pvalue <= 0.05 ? "text-success" : "text-amber-600")}>{r.pvalue.toFixed(2)}</TableCell>
                      <TableCell>{r.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Upcoming tests</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                <li className="rounded-md border p-2 flex items-center justify-between hover:bg-muted/50 transition-colors duration-200">
                  <span className="text-muted-foreground">Instamart breakfast bid curve</span>
                  <span>Starts Mon</span>
                </li>
                <li className="rounded-md border p-2 flex items-center justify-between hover:bg-muted/50 transition-colors duration-200">
                  <span className="text-muted-foreground">Blinkit PDP video vs image</span>
                  <span>Next Thu</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Design panel</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Audience</Label>
                <Input placeholder="e.g. Zepto Mumbai New Users" />
              </div>
              <div>
                <Label>KPI</Label>
                <Input placeholder="e.g. ROAS" />
              </div>
              <div>
                <Label>Sample split</Label>
                <Input placeholder="50/50" />
              </div>
              <div>
                <Label>Min detectable effect</Label>
                <Input placeholder="10%" />
              </div>
              <div>
                <Label>Runtime</Label>
                <Input placeholder="14 days" />
              </div>
              <div className="flex items-end">
                <Button className="w-full hover:bg-primary/90 transition-colors duration-200 border-2 border-green-500" onClick={() => toast({ title: "Draft created.", description: "Experiment saved to backlog." })}>Create draft</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Outcome archive</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="h-40">
                <ChartContainer config={{ lift: { label: "Median lift%", color: "hsl(var(--primary))" } }} className="h-full">
                  <BarChart data={[{m:'CTR',lift:8.2},{m:'CVR',lift:4.1},{m:'ROAS',lift:6.5}] }>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="m" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="lift" radius={3} />
                  </BarChart>
                </ChartContainer>
              </div>
              <div className="h-40">
                <ChartContainer config={{ t: { label: "Treatment" }, c: { label: "Control" } }} className="h-full">
                  <LineChart data={[{w:1,t:100,c:100},{w:2,t:96,c:98},{w:3,t:92,c:97},{w:4,t:90,c:96}] }>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="w" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="t" stroke="hsl(var(--primary))" dot={false} />
                    <Line type="monotone" dataKey="c" stroke="hsl(var(--muted-foreground))" dot={false} />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default PerfExperiments;


