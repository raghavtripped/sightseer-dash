import React from "react";
import { Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const defs: { key: string; desc: string }[] = [
  { key: "ROAS", desc: "Revenue attributed ÷ Ad spend (same-day attribution unless changed)." },
  { key: "CPA", desc: "Ad spend ÷ Conversions (orders)." },
  { key: "Pacing %", desc: "Spend today vs plan; hover for time-aligned pacing." },
  { key: "NTB%", desc: "% of orders from first-time brand buyers (platform reported or modeled)." },
  { key: "Share of shelf", desc: "Share of visible placements for SKU/category on a platform." },
  { key: "Share of search", desc: "Share of top results for key queries on a platform." },
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


