import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type QA = { sku: string; platform: string; image: boolean; title: boolean; bullets: boolean; video: boolean; nutrition: boolean; compliance: boolean; score: number };

const rows: QA[] = [
  { sku: "Aloo Tikki 500g", platform: "Blinkit", image: true, title: true, bullets: true, video: false, nutrition: true, compliance: true, score: 86 },
  { sku: "Veg Nuggets 500g", platform: "Zepto", image: true, title: false, bullets: true, video: false, nutrition: true, compliance: true, score: 72 },
  { sku: "Fries 750g", platform: "Instamart", image: false, title: true, bullets: false, video: false, nutrition: true, compliance: false, score: 58 },
];

const ListingQA: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Listing Content QA & Readiness – Synapse</title>
        <meta name="description" content="Ensure PDPs meet content standards before paid activation." />
        <link rel="canonical" href="/listing-qa" />
      </Helmet>
      <DashboardLayout title="Listing Content QA & Readiness" subtitle="No broken PDPs on paid.">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Checks</CardTitle>
              <Button size="sm" variant="outline">Export CSV</Button>
            </CardHeader>
            <CardContent className="overflow-hidden rounded-lg border bg-card p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Img</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Bullets</TableHead>
                    <TableHead>Video</TableHead>
                    <TableHead>Nutrition</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.sku + r.platform}>
                      <TableCell className="font-medium">{r.sku}</TableCell>
                      <TableCell>{r.platform}</TableCell>
                      <TableCell>{r.image ? "✓" : "✗"}</TableCell>
                      <TableCell>{r.title ? "✓" : "✗"}</TableCell>
                      <TableCell>{r.bullets ? "✓" : "✗"}</TableCell>
                      <TableCell>{r.video ? "✓" : "✗"}</TableCell>
                      <TableCell>{r.nutrition ? "✓" : "✗"}</TableCell>
                      <TableCell>{r.compliance ? "✓" : "✗"}</TableCell>
                      <TableCell className={"text-right " + (r.score >= 80 ? "text-success" : r.score >= 60 ? "text-amber-600" : "text-destructive")}>{r.score}%</TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="secondary">Push updated assets</Button>
                        <Button size="sm" variant="outline">Raise ticket</Button>
                        <Button size="sm" variant="destructive">Hold ads</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Content health</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Red-flag list placeholder with reasons.
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default ListingQA;


