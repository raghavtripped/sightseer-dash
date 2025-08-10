import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BrandPromotionsPricing: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Promotions & Pricing Efficacy – Synapse</title>
        <meta name="description" content="Measure promo uplift, elasticity, and comp pricing to drive decisions." />
        <link rel="canonical" href="/promotions-pricing" />
      </Helmet>
      <DashboardLayout title="Promotions & Pricing Efficacy" subtitle="Did the promo work? What next?">
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Uplift vs control</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Placeholder for incremental sales, % lift, ROAS during promo.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Elasticity: Spend → Sales</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Placeholder response curve by platform.
            </CardContent>
          </Card>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Comp set: Price index vs rivals</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              City-level comp set placeholder.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="secondary">Repeat</Button>
              <Button>Scale to cities</Button>
              <Button variant="outline">Switch to coupon</Button>
              <Button variant="destructive">Stop discount</Button>
            </CardContent>
          </Card>
        </section>
      </DashboardLayout>
    </>
  );
};

export default BrandPromotionsPricing;


