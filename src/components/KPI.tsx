import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Info from "@/components/Info";

type KPIProps = {
  label: string;
  value: React.ReactNode;
  info?: { short: string; long?: string };
  intent?: "good" | "warn" | "bad" | "neutral";
};

export const KPI: React.FC<KPIProps> = ({ label, value, info, intent = "neutral" }) => {
  const color =
    intent === "good" ? "text-emerald-600" : intent === "bad" ? "text-red-600" : intent === "warn" ? "text-amber-600" : "text-foreground";
  return (
    <Card>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span>{label}</span>
            {info ? <Info short={info.short} long={info.long} /> : null}
          </div>
        </div>
        <div className={cn("mt-1 text-lg font-semibold tabular-nums", color)}>{value}</div>
      </CardContent>
    </Card>
  );
};

export default KPI;


