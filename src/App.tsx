import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LiveOps from "./pages/LiveOps";
import ExecutiveOverview from "./pages/CMOExecutiveOverview";
import StrategicHeatmaps from "./pages/CMOStrategicHeatmaps";
import BrandSkuPerformance from "./pages/BrandSkuPerformance";
import BrandDaypartRegion from "./pages/BrandDaypartRegion";
import BrandPromotionsPricing from "./pages/BrandPromotionsPricing";
import PerfAlertsActionLog from "./pages/PerfAlertsActionLog";
import PerfExperiments from "./pages/PerfExperiments";
import CreativePerformance from "./pages/CreativePerformance";
import ListingQA from "./pages/ListingQA";
import AvailabilityWatchtower from "./pages/AvailabilityWatchtower";
import ForecastCoverage from "./pages/ForecastCoverage";
import FinanceLedger from "./pages/FinanceLedger";
import IntegrationsHealth from "./pages/IntegrationsHealth";
import { FiltersProvider } from "@/context/FiltersContext";

const queryClient = new QueryClient();

// ScrollToTop component that scrolls to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo(0, 0);
    
    // For mobile devices, also ensure smooth scrolling
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <FiltersProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/live-ops" element={<LiveOps />} />
              <Route path="/executive-overview" element={<ExecutiveOverview />} />
              <Route path="/strategic-heatmaps" element={<StrategicHeatmaps />} />
              <Route path="/sku-performance" element={<BrandSkuPerformance />} />
              <Route path="/daypart-region-planner" element={<BrandDaypartRegion />} />
              <Route path="/promotions-pricing" element={<BrandPromotionsPricing />} />
              <Route path="/alerts-action-log" element={<PerfAlertsActionLog />} />
              <Route path="/experiments" element={<PerfExperiments />} />
              <Route path="/creative-performance" element={<CreativePerformance />} />
              <Route path="/listing-qa" element={<ListingQA />} />
              <Route path="/availability-watchtower" element={<AvailabilityWatchtower />} />
              <Route path="/forecast-coverage" element={<ForecastCoverage />} />
              <Route path="/finance-ledger" element={<FinanceLedger />} />
              <Route path="/integrations-health" element={<IntegrationsHealth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </FiltersProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
