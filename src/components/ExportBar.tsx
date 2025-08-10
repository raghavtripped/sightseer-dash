import React from "react";
import { Button } from "@/components/ui/button";

export const ExportBar: React.FC<{ onDeck?: () => void } & React.HTMLAttributes<HTMLDivElement>> = ({ onDeck, className }) => {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Button size="sm" variant="outline">Export PNG</Button>
      <Button size="sm" variant="outline">Export CSV</Button>
      <Button size="sm" onClick={onDeck}>One-click deck</Button>
    </div>
  );
};

export default ExportBar;


