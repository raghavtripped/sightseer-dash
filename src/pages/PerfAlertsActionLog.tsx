import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

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
        <title>Alerts & action log — Synapse</title>
        <meta name="description" content="Monitor alerts, review actions, and manage overrides to trust but verify AI." />
        <link rel="canonical" href="/alerts-action-log" />
      </Helmet>
      <DashboardLayout title="Alerts & action log" subtitle="See issues early. Trust, but verify the AI.">
        <Tabs defaultValue="alerts" className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">All</Badge>
              <Badge variant="destructive">High</Badge>
              <Badge variant="secondary">Med</Badge>
              <Badge variant="outline">Low</Badge>
              <span className="mx-2 text-muted-foreground">—</span>
              <Badge variant="outline">Open</Badge>
              <Badge variant="outline">Auto-resolved</Badge>
              <Badge variant="outline">Snoozed</Badge>
              <Badge variant="outline">Closed</Badge>
            </div>
            <Input className="w-56" placeholder="Search alerts..." />
          </div>
          <TabsList>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="log">Action Log</TabsTrigger>
            <TabsTrigger value="overrides">Overrides</TabsTrigger>
          </TabsList>
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Alert stream</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {alerts.map((a, i) => (
                  <div key={i} className="rounded-md border p-3 text-sm cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={a.pri === 'High' ? 'destructive' : a.pri === 'Medium' ? 'secondary' : 'outline'}>{a.pri}</Badge>
                        <div className="font-medium">{a.msg}</div>
                      </div>
                      <Button size="sm" variant="outline">Open</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="log">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Action log</CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto rounded-lg border bg-card p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Agent</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Outcome Δ</TableHead>
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
          </TabsContent>
          <TabsContent value="overrides">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Overrides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                   <span>Approve queued changes</span>
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
          </TabsContent>
        </Tabs>
      </DashboardLayout>
    </>
  );
};

export default PerfAlertsActionLog;


