import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ForecastCoverage: React.FC = () => {
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
              <CardTitle className="text-sm">Forecast: next 7/14 days</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Line charts placeholder with CI bands.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Coverage map</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Dark-store presence vs target radius; stock heat placeholder.
            </CardContent>
          </Card>
        </section>
        <section>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <button className="rounded-md bg-secondary px-3 py-2 text-sm">Pre-position stock</button>
              <button className="rounded-md border px-3 py-2 text-sm">Throttle bids if projected OOS</button>
              <button className="rounded-md px-3 py-2 text-sm bg-primary text-primary-foreground">Create backup SKU mapping</button>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default ForecastCoverage;


