import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ExportBar from "@/components/ExportBar";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";

type SkuRow = {
  sku: string;
  impr: number;
  clicks: number;
  conv: number;
  sales: number;
  roas: number;
  cpa: number;
  price: number;
  rating: number;
  stock: "In stock" | "Low" | "OOS";
  promo?: string;
};

const rows: SkuRow[] = [
  { sku: "Aloo Tikki 500g", impr: 82000, clicks: 2100, conv: 260, sales: 7.2, roas: 6.0, cpa: 112, price: 110, rating: 4.3, stock: "In stock", promo: "10% off" },
  { sku: "Veg Nuggets 500g", impr: 64000, clicks: 1700, conv: 180, sales: 5.1, roas: 4.4, cpa: 128, price: 145, rating: 4.1, stock: "Low" },
  { sku: "Fries 750g", impr: 54000, clicks: 1200, conv: 130, sales: 3.8, roas: 3.9, cpa: 142, price: 160, rating: 4.2, stock: "OOS" },
];

const BrandSkuPerformance: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>SKU Performance Drilldown – Synapse</title>
        <meta name="description" content="Table and charts to identify hero and laggard SKUs with actions." />
        <link rel="canonical" href="/sku-performance" />
      </Helmet>
      <DashboardLayout title="SKU Performance Drilldown" subtitle="Which SKUs to back off / double down?">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">SKU table</CardTitle>
              <ExportBar />
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Impr</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Conv</TableHead>
                    <TableHead className="text-right">Sales (L)</TableHead>
                    <TableHead className="text-right">ROAS</TableHead>
                    <TableHead className="text-right">CPA</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Promo</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.sku}>
                      <TableCell className="font-medium">{r.sku}</TableCell>
                      <TableCell className="text-right">{r.impr.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.clicks.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.conv.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{r.sales.toFixed(1)}</TableCell>
                      <TableCell className={"text-right " + (r.roas >= 4.5 ? "text-success" : r.roas >= 4 ? "text-amber-600" : "text-destructive")}>
                        {r.roas.toFixed(1)}x
                      </TableCell>
                      <TableCell className="text-right">₹{r.cpa}</TableCell>
                      <TableCell className="text-right">₹{r.price}</TableCell>
                      <TableCell className="text-right">{r.rating.toFixed(1)}</TableCell>
                      <TableCell>{r.stock}</TableCell>
                      <TableCell>{r.promo || "-"}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="secondary">Hero</Button>
                        <Button size="sm" variant="outline">Nurture</Button>
                        <Button size="sm" variant="ghost">Fix content</Button>
                        <Button size="sm">Trial promo</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{ sales: { label: "Sales (L)", color: "hsl(var(--primary))" } }}
                className="h-64"
              >
                <BarChart data={rows}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="sku" tickLine={false} axisLine={false} hide />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default BrandSkuPerformance;


