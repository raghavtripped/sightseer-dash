import React from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const defs: { key: string; desc: string }[] = [
  { key: "ROAS", desc: "Revenue ÷ ad spend. Directional by platform; validate true lift with experiments/holdouts." },
  { key: "CPA", desc: "Ad spend ÷ conversions (orders). Lower is better." },
  { key: "Pacing", desc: "Today's spend vs plan for the day. Uses time-aligned pacing windows." },
  { key: "NTB%", desc: "% of orders from first-time brand buyers (platform-reported or modeled)." },
  { key: "Share of wallet", desc: "Your share of total category sales on a platform." },
  { key: "Share of shelf", desc: "Share of visible placements for SKU/category on a platform." },
  { key: "Share of search", desc: "Share of top results for key queries on a platform." },
  { key: "Bandit / Thompson Sampling", desc: "Allocator that shifts budget toward better-performing pockets while reserving a small exploration budget." },
  { key: "Exploration", desc: "Small test budget (e.g., 5–15%) to learn new platform × city × daypart cells." },
  { key: "Holdout", desc: "A city/segment where changes are withheld to measure incremental lift." },
  { key: "OOS", desc: "Out of stock. Ads are paused when availability is poor to avoid waste." },
  { key: "Fatigue", desc: "When CTR drops materially vs recent average; creative refresh is recommended." },
  { key: "Attribution", desc: "Last-click within each platform unless otherwise specified; use experiments to validate causality." },
  { key: "Marketing Stream (Amazon)", desc: "Near-real-time event feed for pacing/auction signals from Amazon Ads." },
  { key: "Circuit breaker", desc: "Safety that pauses optimizers when data freshness or API error rates breach thresholds." },
];

export const MetricDefinitions: React.FC = () => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 ring-1 ring-border hover:bg-secondary" aria-label="Metric definitions">
          <Info size={14} />
          <span>Metric definitions</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-80 text-xs">
        <div className="space-y-2">
          {defs.map((d) => (
            <div key={d.key}>
              <div className="font-medium">{d.key}</div>
              <div className="text-muted-foreground">{d.desc}</div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  </div>
);

export default MetricDefinitions;


