import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const FinanceLedger: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Budget, Spend & ROI Ledger – Synapse</title>
        <meta name="description" content="Audit-friendly view of budget, spend, sales, and margin with exports." />
        <link rel="canonical" href="/finance-ledger" />
      </Helmet>
      <DashboardLayout title="Budget, Spend & ROI Ledger" subtitle="Money view, clean enough for audit.">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Waterfall</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Placeholder for Plan → Commit → Deploy → Spend → Sales → Margin → ROAS.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Exports</CardTitle>
              <div className="space-x-2">
                <Button size="sm" variant="outline">XLS/CSV</Button>
                <Button size="sm">Month-end pack</Button>
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


