import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line } from "recharts";

const PerfLiveOpsTicker: React.FC = () => {
  const conv = [10, 14, 13, 16, 18, 21, 19, 22, 24, 27, 29, 31].map((v, i) => ({ x: i, y: v }))
  const spend = [8, 9, 10, 11, 14, 16, 15, 17, 18, 19, 20, 22].map((v, i) => ({ x: i, y: v }))
  return (
    <>
      <Helmet>
        <title>Live ops ticker — Synapse</title>
        <meta name="description" content="Quick ticker with conversions and budget burn." />
        <link rel="canonical" href="/live-ops-ticker" />
      </Helmet>
      <DashboardLayout title="Live ops ticker" subtitle="Today vs yesterday conversions; budget burn rate.">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Conversions (hourly)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">2,140</div>
              <ChartContainer config={{}} className="h-24">
                <LineChart data={conv}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget burn (hourly)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">₹2.9L</div>
              <ChartContainer config={{}} className="h-24">
                <LineChart data={spend}>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="y" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default PerfLiveOpsTicker;


