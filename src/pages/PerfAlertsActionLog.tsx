import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const alerts = [
  { pri: "High", msg: "OOS: Aloo Tikki 500g unavailable on Zepto-Mumbai. 3 campaigns auto-paused. Spend saved est. ₹22k." },
  { pri: "Medium", msg: "Creative fatigue: Blinkit banner CTR ↓ from 1.5% → 0.6%. Rotated to V3." },
  { pri: "Low", msg: "API failure: Retry succeeded for Amazon product feed." },
];

const actions = [
  { time: "09:34", agent: "AI", action: "Pause", entity: "C-002", delta: "CPA -7%" },
  { time: "10:05", agent: "Human", action: "Budget shift", entity: "Blinkit Snacks Delhi", delta: "ROAS +0.3x" },
];

const PerfAlertsActionLog: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Alerts & Action Log – Synapse</title>
        <meta name="description" content="Monitor alerts, review actions, and manage overrides to trust but verify AI." />
        <link rel="canonical" href="/alerts-action-log" />
      </Helmet>
      <DashboardLayout title="Alerts & Action Log" subtitle="See issues early, trust but verify AI.">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Alert stream</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {alerts.map((a, i) => (
                <div key={i} className="rounded-md border p-3 text-sm">
                  <div className="text-xs text-muted-foreground">{a.pri} priority</div>
                  <div>{a.msg}</div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Overrides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Approve queued AI changes</span>
                <div className="space-x-2">
                  <Button size="sm" variant="secondary">Approve</Button>
                  <Button size="sm" variant="outline">Reject</Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Temporary caps/floors</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span>Explore/exploit aggressiveness</span>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </section>
        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Action log</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Affected entity</TableHead>
                    <TableHead>Outcome</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actions.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.time}</TableCell>
                      <TableCell>{r.agent}</TableCell>
                      <TableCell>{r.action}</TableCell>
                      <TableCell>{r.entity}</TableCell>
                      <TableCell>{r.delta}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default PerfAlertsActionLog;


