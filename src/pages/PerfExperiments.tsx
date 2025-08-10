import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PerfExperiments: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Experiments / A/B & Holdouts – Synapse</title>
        <meta name="description" content="Design, monitor, and archive experiments to prove incrementality." />
        <link rel="canonical" href="/experiments" />
      </Helmet>
      <DashboardLayout title="Experiments / A/B & Holdouts" subtitle="Prove incrementality, iterate creatives/bids.">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Running tests</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Cards placeholder showing variant vs control, p-value, lift%.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Upcoming tests</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Calendar placeholder.
            </CardContent>
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Design panel</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Audience</Label>
                <Input placeholder="e.g. Zepto Mumbai New Users" />
              </div>
              <div>
                <Label>KPI</Label>
                <Input placeholder="e.g. ROAS" />
              </div>
              <div>
                <Label>Sample split</Label>
                <Input placeholder="50/50" />
              </div>
              <div>
                <Label>Min detectable effect</Label>
                <Input placeholder="10%" />
              </div>
              <div>
                <Label>Runtime</Label>
                <Input placeholder="14 days" />
              </div>
              <div className="flex items-end">
                <Button className="w-full">Create draft</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Outcome archive</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Learnings library & reusable templates placeholder.
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default PerfExperiments;


