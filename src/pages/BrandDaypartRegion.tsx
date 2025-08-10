import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const cities = ["Delhi", "Mumbai", "Bengaluru", "Pune", "Hyderabad"];
const dayparts = ["Breakfast", "Lunch", "Snacks", "Dinner"];

type Matrix = Record<string, Record<string, number>>

const initMatrix: Matrix = cities.reduce((acc, c) => {
  const inner = dayparts.reduce((m, d) => ({ ...m, [d]: 50 }), {} as Record<string, number>)
  acc[c] = inner
  return acc
}, {} as Matrix)

const BrandDaypartRegion: React.FC = () => {
  const { toast } = (useToast as any)();
  const [matrix, setMatrix] = React.useState<Matrix>(initMatrix)
  const cityTotal = (c: string) => Object.values(matrix[c]).reduce((a, b) => a + b, 0)
  const overall = cities.reduce((sum, c) => sum + cityTotal(c), 0)
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
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{c}</div>
                    <div className="text-xs text-muted-foreground">Total: ₹{(cityTotal(c) * 1.2).toFixed(0)}k</div>
                  </div>
                  {dayparts.map((d) => (
                    <div key={d} className="grid grid-cols-12 items-center gap-3">
                      <div className="col-span-3 text-xs text-muted-foreground">{d}</div>
                      <div className="col-span-7">
                        <Slider
                          value={[matrix[c][d]]}
                          max={100}
                          step={1}
                          onValueChange={([v]) => setMatrix((m) => ({ ...m, [c]: { ...m[c], [d]: v } }))}
                        />
                      </div>
                      <div className="col-span-2 text-right text-xs">₹{(matrix[c][d] * 1.2).toFixed(0)}k</div>
                    </div>
                  ))}
                </div>
              ))}
              <div className="pt-2 text-right text-xs text-muted-foreground">Overall plan: ₹{(overall * 1.2).toFixed(0)}k</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex-row items-center justify-between">
              <CardTitle className="text-sm">Actions</CardTitle>
              <Button size="sm" onClick={() => toast({ title: "Plan generated", description: `₹${(overall * 1.2).toFixed(0)}k across ${cities.length} cities` })}>Generate next-week plan</Button>
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


