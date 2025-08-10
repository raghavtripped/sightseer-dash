import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PerfLiveOpsTicker: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Live Ops Ticker – Synapse</title>
        <meta name="description" content="Quick ticker with conversions and budget burn." />
        <link rel="canonical" href="/live-ops-ticker" />
      </Helmet>
      <DashboardLayout title="Live Ops Ticker" subtitle="Today vs yesterday conversions; budget burn rate.">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Ticker</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Placeholder ticker. Use real-time data here.
          </CardContent>
        </Card>
      </DashboardLayout>
    </>
  );
};

export default PerfLiveOpsTicker;


