import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { useToast } from "@/hooks/use-toast";

const response = Array.from({ length: 6 }).map((_, i) => ({ spend: i * 10, blinkit: 20 + i * 8, zepto: 18 + i * 7 }))

const comp = [
  { city: "Delhi", ours: 100, rivalA: 98, rivalB: 102 },
  { city: "Mumbai", ours: 102, rivalA: 101, rivalB: 99 },
  { city: "Pune", ours: 99, rivalA: 96, rivalB: 101 },
]

const BrandPromotionsPricing: React.FC = () => {
  const { toast } = (useToast as any)();
  return (
    <>
      <Helmet>
        <title>Promotions & Pricing Efficacy – Synapse</title>
        <meta name="description" content="Measure promo uplift, elasticity, and comp pricing to drive decisions." />
        <link rel="canonical" href="/promotions-pricing" />
      </Helmet>
      <DashboardLayout title="Promotions & Pricing Efficacy" subtitle="Did the promo work? What next?">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Uplift vs control</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Placeholder for incremental sales, % lift, ROAS during promo.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Elasticity: Spend → Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ blinkit: { label: "Blinkit", color: "hsl(var(--primary))" }, zepto: { label: "Zepto", color: "hsl(var(--muted-foreground))" } }}
                className="h-56"
              >
                <LineChart data={response}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="spend" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="blinkit" stroke="var(--color-blinkit)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="zepto" stroke="var(--color-zepto)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Comp set: Price index vs rivals</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Ours</TableHead>
                    <TableHead className="text-right">Rival A</TableHead>
                    <TableHead className="text-right">Rival B</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comp.map((r) => (
                    <TableRow key={r.city}>
                      <TableCell className="font-medium">{r.city}</TableCell>
                      <TableCell className="text-right">{r.ours}</TableCell>
                      <TableCell className="text-right">{r.rivalA}</TableCell>
                      <TableCell className="text-right">{r.rivalB}</TableCell>
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
              <Button variant="secondary" onClick={() => toast({ title: "Promo queued", description: "Repeat best performer city-wide" })}>Repeat</Button>
              <Button onClick={() => toast({ title: "Scaled", description: "Replicated to top 5 cities" })}>Scale to cities</Button>
              <Button variant="outline" onClick={() => toast({ title: "Coupon set", description: "Switched 10% off → ₹30 coupon" })}>Switch to coupon</Button>
              <Button variant="destructive" onClick={() => toast({ title: "Stopped", description: "Discount removed from low-ROI cities" })}>Stop discount</Button>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default BrandPromotionsPricing;


