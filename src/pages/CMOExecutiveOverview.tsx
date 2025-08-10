import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ExportBar from "@/components/ExportBar";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const channelMix = [
  { channel: "Blinkit", spend: 18, sales: 26 },
  { channel: "Zepto", spend: 14, sales: 20 },
  { channel: "Instamart", spend: 16, sales: 18 },
  { channel: "Amazon", spend: 22, sales: 20 },
  { channel: "Flipkart", spend: 30, sales: 16 },
];

const cityLeaderboard = [
  { city: "Delhi", roas: 5.2, sales: 12.3, cpa: 115 },
  { city: "Mumbai", roas: 4.8, sales: 10.9, cpa: 128 },
  { city: "Bengaluru", roas: 4.6, sales: 9.8, cpa: 131 },
  { city: "Pune", roas: 4.1, sales: 7.4, cpa: 142 },
  { city: "Hyderabad", roas: 4.0, sales: 6.9, cpa: 138 },
];

const ExecutiveOverview: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Executive Overview – Synapse</title>
        <meta name="description" content="High-level performance snapshot: ROAS, spend, sales, and contribution." />
        <link rel="canonical" href="/executive-overview" />
      </Helmet>

      <DashboardLayout title="Executive Overview" subtitle="Are we winning? Where’s the return coming from?">
        <section className="grid gap-4 md:grid-cols-4">
          <Kpi title="Overall ROAS" value="4.6x" state="good" />
          <Kpi title="Q-comm ROAS" value="5.1x" state="good" />
          <Kpi title="Trad e-com ROAS" value="3.9x" state="warn" />
          <Kpi title="Attributable Sales" value="₹48.3L" />
          <Kpi title="NTB%" value="41%" />
          <Kpi title="Spend (7d)" value="₹48.3L" />
          <Kpi title="CPA" value="₹128" />
          <Kpi title="Share of Wallet" value="26%" />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Channel mix</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ spend: { label: "Spend", color: "hsl(var(--primary))" }, sales: { label: "Sales", color: "hsl(var(--muted-foreground))" } }}
                className="h-64"
              >
                <BarChart data={channelMix}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="channel" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="spend" radius={4} />
                  <Bar dataKey="sales" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">City leaderboard</CardTitle>
              <ExportBar />
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">ROAS</TableHead>
                    <TableHead className="text-right">Sales (L)</TableHead>
                    <TableHead className="text-right">CPA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cityLeaderboard.map((c) => (
                    <TableRow key={c.city}>
                      <TableCell className="font-medium">{c.city}</TableCell>
                      <TableCell className={"text-right " + (c.roas >= 4.5 ? "text-success" : c.roas >= 4 ? "text-amber-600" : "text-destructive")}>
                        {c.roas.toFixed(1)}x
                      </TableCell>
                      <TableCell className="text-right">{c.sales.toFixed(1)}</TableCell>
                      <TableCell className="text-right">₹{c.cpa}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Contribution bridge (baseline → Synapse uplift)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Placeholder waterfall. Use your data layer to replace with a proper bridge chart.
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button variant="secondary">Export Board Pack (PDF)</Button>
              <Button>Schedule weekly email</Button>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

const Kpi: React.FC<{ title: string; value: string; state?: "good" | "warn" | "bad" }> = ({ title, value, state }) => (
  <Card>
    <CardHeader className="pb-1">
      <CardTitle className="text-xs text-muted-foreground font-normal">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={
        "text-xl font-semibold " + (state === "good" ? "text-success" : state === "bad" ? "text-destructive" : "")
      }>
        {value}
      </div>
    </CardContent>
  </Card>
);

export default ExecutiveOverview;


