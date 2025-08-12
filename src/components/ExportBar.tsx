import React from "react";
import { Button } from "@/components/ui/button";
import { COPY } from "@/copy";

export const ExportBar: React.FC<{ onDeck?: () => void } & React.HTMLAttributes<HTMLDivElement>> = ({ onDeck, className }) => {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Button size="sm" variant="outline">{COPY.common.exportPNG}</Button>
      <Button size="sm" variant="outline">{COPY.common.exportCSV}</Button>
      <Button size="sm" onClick={onDeck}>{COPY.common.oneClickDeck}</Button>
    </div>
  );
};

export default ExportBar;


