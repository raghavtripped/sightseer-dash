import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TestRow = { id: string; name: string; platform: string; kpi: string; lift: number; pvalue: number; status: "Running" | "Holdout" | "Completed" };

const running: TestRow[] = [
  { id: "T-101", name: "Zepto dinner headline", platform: "Zepto", kpi: "ROAS", lift: 12.4, pvalue: 0.03, status: "Running" },
  { id: "T-102", name: "Blinkit snacks bid +10%", platform: "Blinkit", kpi: "Conv", lift: 6.8, pvalue: 0.07, status: "Running" },
];

const PerfExperiments: React.FC = () => {
  const { toast } = (useToast as any)();
  return (
    <>
      <Helmet>
        <title>Experiments / A/B & Holdouts – Synapse</title>
        <meta name="description" content="Design, monitor, and archive experiments to prove incrementality." />
        <link rel="canonical" href="/experiments" />
      </Helmet>
      <DashboardLayout title="Experiments / A/B & Holdouts" subtitle="Prove incrementality, iterate creatives/bids.">
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
                    <TableRow key={r.id}>
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
            <CardContent className="text-sm text-muted-foreground">
              Calendar placeholder.
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
                <Button className="w-full" onClick={() => toast({ title: "Draft created", description: "Experiment saved to backlog" })}>Create draft</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Outcome archive</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Learnings library & reusable templates placeholder.
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default PerfExperiments;


