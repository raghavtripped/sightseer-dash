import React from "react";
import { Button } from "@/components/ui/button";
import { COPY } from "@/copy";

export const ExportBar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className }) => {
  const handleExportPNG = () => {
    // Implementation for PNG export
    // This would typically use html2canvas or similar library
    console.log("Exporting as PNG...");
    // TODO: Implement actual PNG export functionality
    alert("PNG export functionality will be implemented here");
  };

  const handleExportCSV = () => {
    // Implementation for CSV export
    console.log("Exporting as CSV...");
    // TODO: Implement actual CSV export functionality
    alert("CSV export functionality will be implemented here");
  };

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Button size="sm" variant="outline" onClick={handleExportPNG}>
        {COPY.common.exportPNG}
      </Button>
      <Button size="sm" variant="outline" onClick={handleExportCSV}>
        {COPY.common.exportCSV}
      </Button>
    </div>
  );
};

export default ExportBar;


