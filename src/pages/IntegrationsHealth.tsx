import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const IntegrationsHealth: React.FC = () => {
  const { toast } = (useToast as any)();
  return (
    <>
      <Helmet>
        <title>Integrations & system health — Synapse</title>
        <meta name="description" content="Connector uptime, RPA jobs, and security posture with actions." />
        <link rel="canonical" href="/integrations-health" />
      </Helmet>
      <DashboardLayout title="Integrations & system health" subtitle="Pipes, bots, and auth are green.">
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">API connectors</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div>Uptime: 99.9%</div>
              <div>Avg latency: 420 ms</div>
              <div>Last sync: 15 min ago</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">RPA jobs</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div>Success: 42</div>
              <div>Fail: 2</div>
              <div>Retry queue: 1</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Security</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div>Users: 23</div>
              <div>Last privileged action: 2 days ago</div>
              <div>Token expiry: 12 days</div>
            </CardContent>
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Connectors</CardTitle>
              <div className="space-x-2">
                <Button size="sm" variant="secondary" className="hover:bg-secondary/80 transition-colors duration-200 border-2 border-green-500" onClick={() => toast({ title: "Re-ingest started", description: "Pulling last 24h from all connectors" })}>Re-ingest</Button>
                <Button size="sm" variant="outline" className="hover:bg-muted transition-colors duration-200 border-2 border-green-500" onClick={() => toast({ title: "Rollback queued", description: "Reverting to previous schema" })}>Rollback</Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>System</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last sync</TableHead>
                    <TableHead>Rows</TableHead>
                    <TableHead>Schema drift</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { sys: "Blinkit API", st: "Up", last: "15m", rows: "142k", drift: "No" },
                    { sys: "Zepto API", st: "Up", last: "18m", rows: "121k", drift: "No" },
                    { sys: "Amazon Ads", st: "Degraded", last: "32m", rows: "88k", drift: "No" },
                  ].map((r) => (
                    <TableRow key={r.sys}>
                      <TableCell className="font-medium">{r.sys}</TableCell>
                      <TableCell>{r.st}</TableCell>
                      <TableCell>{r.last}</TableCell>
                      <TableCell>{r.rows}</TableCell>
                      <TableCell>{r.drift}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="secondary" className="hover:bg-secondary/80 transition-colors duration-200 border-2 border-green-500" onClick={() => toast({ title: "Keys rotated", description: "All connectors updated" })}>Rotate keys</Button>
              <Button className="hover:bg-primary/90 transition-colors duration-200 border-2 border-green-500" onClick={() => toast({ title: "Owner notified", description: "Email sent to data@itc.in" })}>Notify owner</Button>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default IntegrationsHealth;


