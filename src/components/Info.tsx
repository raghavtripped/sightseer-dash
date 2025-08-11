import * as React from "react";
import { Info as InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type InfoProps = {
  label?: React.ReactNode;
  short: string; // tooltip copy
  long?: string; // optional expanded copy for learn more
  className?: string;
};

/**
 * Info renders a small ⓘ icon with hover tooltip and optional click-to-expand dialog.
 * Use this next to metric labels to keep pages self-explanatory.
 */
export const Info: React.FC<InfoProps> = ({ label, short, long, className }) => {
  const hasLong = Boolean(long);
  const icon = (
    <InfoIcon className="h-3.5 w-3.5 text-muted-foreground/80" aria-hidden />
  );

  return (
    <div className={cn("inline-flex items-center gap-1 align-middle", className)}>
      {label ? <span>{label}</span> : null}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {hasLong ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-sm p-0.5 ring-1 ring-transparent hover:ring-border"
                    aria-label="Learn more"
                  >
                    {icon}
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" sideOffset={6} className="max-w-sm text-xs leading-relaxed">
                  <div className="font-medium mb-1">{typeof label === "string" ? label : "Details"}</div>
                  <div className="text-muted-foreground whitespace-pre-line">{long}</div>
                </PopoverContent>
              </Popover>
            ) : (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-sm p-0.5 ring-1 ring-transparent hover:ring-border"
                aria-label="Info"
              >
                {icon}
              </button>
            )}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs leading-relaxed">{short}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Info;


