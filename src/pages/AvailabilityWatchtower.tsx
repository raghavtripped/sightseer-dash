import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Row = { city: string; sku: string; stock: "In stock" | "Low" | "OOS"; eta: string; ads: "Active" | "Paused" };

const rows: Row[] = [
  { city: "Delhi", sku: "Aloo Tikki 500g", stock: "In stock", eta: "-", ads: "Active" },
  { city: "Mumbai", sku: "Veg Nuggets 500g", stock: "OOS", eta: "Tomorrow 10am", ads: "Paused" },
  { city: "Pune", sku: "Fries 750g", stock: "Low", eta: "Today 6pm", ads: "Paused" },
];

const AvailabilityWatchtower: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Availability & OOS Watchtower – Synapse</title>
        <meta name="description" content="Visibility into stock status to avoid wasted spend and coordinate ops." />
        <link rel="canonical" href="/availability-watchtower" />
      </Helmet>
      <DashboardLayout title="Availability & OOS Watchtower" subtitle="Don’t spend on thin air.">
        <section className="grid gap-4 md:grid-cols-3">
          <Kpi title="% SKUs in-stock" value="92%" state="good" />
          <Kpi title="Ads paused due to OOS" value="5" state="warn" />
          <Kpi title="Spend saved (7d)" value="₹2.7L" />
        </section>
        <section>
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">By city & SKU</CardTitle>
              <Button size="sm" variant="outline">Export CSV</Button>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>City</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Next replenishment</TableHead>
                    <TableHead>Ads state</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{r.city}</TableCell>
                      <TableCell>{r.sku}</TableCell>
                      <TableCell>{r.stock}</TableCell>
                      <TableCell>{r.eta}</TableCell>
                      <TableCell>{r.ads}</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="secondary">Notify replenishment</Button>
                        <Button size="sm" variant="outline">Allow substitution</Button>
                        <Button size="sm">Lift hold</Button>
                      </TableCell>
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

const Kpi: React.FC<{ title: string; value: string; state?: "good" | "warn" | "bad" }> = ({ title, value, state }) => (
  <Card>
    <CardHeader className="pb-1">
      <CardTitle className="text-xs text-muted-foreground font-normal">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={
        "text-xl font-semibold " + (state === "good" ? "text-success" : state === "bad" ? "text-destructive" : state === "warn" ? "text-amber-600" : "")
      }>
        {value}
      </div>
    </CardContent>
  </Card>
);

export default AvailabilityWatchtower;


