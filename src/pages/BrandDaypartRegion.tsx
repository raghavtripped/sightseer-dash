import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const cities = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Hyderabad"];
const dayparts = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const BrandDaypartRegion: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Daypart × Region Planner – Synapse</title>
        <meta name="description" content="Plan budgets by city and daypart with availability matrix and guardrails." />
        <link rel="canonical" href="/daypart-region-planner" />
      </Helmet>
      <DashboardLayout title="Daypart × Region Planner" subtitle="Right product, right moment, right city.">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">SKU × Daypart (conv / ROAS)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Heatmap placeholder. Add your SKU performance by daypart.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">City × SKU availability & share of shelf</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Availability matrix placeholder.
            </CardContent>
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget sliders per city/daypart</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cities.map((c) => (
                <div key={c} className="space-y-2">
                  <div className="text-sm font-medium">{c}</div>
                  {dayparts.map((d) => (
                    <div key={d} className="grid grid-cols-12 items-center gap-3">
                      <div className="col-span-3 text-xs text-muted-foreground">{d}</div>
                      <div className="col-span-7">
                        <Slider defaultValue={[50]} max={100} step={1} />
                      </div>
                      <div className="col-span-2 text-right text-xs">₹{(50 * 1.2).toFixed(0)}k</div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Actions</CardTitle>
              <Button size="sm">Generate next-week plan</Button>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Guardrails preview placeholder from PLAN.
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default BrandDaypartRegion;


