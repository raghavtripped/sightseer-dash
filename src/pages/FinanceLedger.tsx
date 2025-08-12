import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const FinanceLedger: React.FC = () => {
  const { toast } = (useToast as any)();
  return (
    <>
      <Helmet>
        <title>Budget, spend & ROI ledger — Synapse</title>
        <meta name="description" content="Audit-friendly view of budget, spend, sales, and margin with exports." />
        <link rel="canonical" href="/finance-ledger" />
      </Helmet>
      <DashboardLayout title="Budget, spend & ROI ledger" subtitle="Money view, clean enough for audit.">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Waterfall</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 gap-2 text-center text-xs">
                {[
                  { k: "Plan", v: "₹90L" },
                  { k: "Commit", v: "₹85L" },
                  { k: "Deploy", v: "₹82L" },
                  { k: "Spend", v: "₹80L" },
                  { k: "Sales", v: "₹360L" },
                  { k: "ROAS", v: "4.5×" },
                ].map((s) => (
                  <div key={s.k} className="rounded-md border p-3">
                    <div className="text-muted-foreground">{s.k}</div>
                    <div className="text-base font-semibold">{s.v}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Exports</CardTitle>
              <div className="space-x-2">
                <Button size="sm" variant="outline" onClick={() => toast({ title: "Exported.", description: "Ledger exported as CSV." })}>Export CSV</Button>
                <Button size="sm" onClick={() => toast({ title: "Month-end pack prepared.", description: "" })}>Month-end pack</Button>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Add variance notes here as needed.
            </CardContent>
          </Card>
        </section>
        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">By platform / city / brand</CardTitle>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dimension</TableHead>
                    <TableHead className="text-right">Budget</TableHead>
                    <TableHead className="text-right">Spend</TableHead>
                    <TableHead className="text-right">Variance</TableHead>
                    <TableHead className="text-right">ROAS</TableHead>
                    <TableHead className="text-right">CAC</TableHead>
                    <TableHead className="text-right">GM after discount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["Blinkit", "Zepto", "Instamart"].map((d) => (
                    <TableRow key={d}>
                      <TableCell className="font-medium">{d}</TableCell>
                      <TableCell className="text-right">₹3.0L</TableCell>
                      <TableCell className="text-right">₹2.7L</TableCell>
                      <TableCell className="text-right">₹-0.3L</TableCell>
                      <TableCell className="text-right">4.6x</TableCell>
                      <TableCell className="text-right">₹128</TableCell>
                      <TableCell className="text-right">23%</TableCell>
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

export default FinanceLedger;


