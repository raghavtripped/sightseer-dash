import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

const trend = Array.from({ length: 14 }).map((_, i) => ({ day: `D${i + 1}`, demand: 100 + i * 6 + (i % 4 === 0 ? 12 : -4) }))

const cityCoverage = [
  { city: "Delhi", forecast: 12.4, coverage: 0.93, risk: "Low" },
  { city: "Mumbai", forecast: 10.1, coverage: 0.78, risk: "Medium" },
  { city: "Bengaluru", forecast: 9.5, coverage: 0.88, risk: "Low" },
  { city: "Pune", forecast: 7.2, coverage: 0.67, risk: "High" },
]

const ForecastCoverage: React.FC = () => {
  const { toast } = (useToast as any)();
  return (
    <>
      <Helmet>
        <title>Forecast & Coverage – Synapse</title>
        <meta name="description" content="Demand forecasts and coverage planning by city and daypart." />
        <link rel="canonical" href="/forecast-coverage" />
      </Helmet>
      <DashboardLayout title="Forecast & Coverage" subtitle="Be ready for demand spikes by slot/city.">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Forecast: next 14 days</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{ demand: { label: "Demand Index", color: "hsl(var(--primary))" } }} className="h-56">
                <LineChart data={trend}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="demand" stroke="var(--color-demand)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Coverage map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {cityCoverage.map((r) => (
                  <div key={r.city} className="rounded-md border p-3">
                    <div className="text-sm font-medium">{r.city}</div>
                    <div className="text-xs text-muted-foreground">Dark stores: {Math.round(r.coverage * 10)}/10 · Stock risk: {r.risk}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => toast({ title: "Pre-position planned", description: "Delhi, Mumbai, Pune for weekend spike" })}>Pre-position stock</Button>
              <Button variant="outline" onClick={() => toast({ title: "Guardrail set", description: "Throttle bids on high-risk cities" })}>Throttle bids if projected OOS</Button>
              <Button onClick={() => toast({ title: "Backup mapping created", description: "Fries → Wedges for Instamart Pune" })}>Create backup SKU mapping</Button>
            </CardContent>
          </Card>
        </section>
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
                    <TableHead className="text-right">Coverage</TableHead>
                    <TableHead>Risk</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cityCoverage.map((r) => (
                    <TableRow key={r.city}>
                      <TableCell className="font-medium">{r.city}</TableCell>
                      <TableCell className="text-right">{r.forecast.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{Math.round(r.coverage * 100)}%</TableCell>
                      <TableCell className={r.risk === 'High' ? 'text-destructive' : r.risk === 'Medium' ? 'text-amber-600' : 'text-success'}>{r.risk}</TableCell>
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

export default ForecastCoverage;


