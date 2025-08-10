import React, { createContext, useContext, useMemo, useState } from "react";
import { addDays, subDays } from "date-fns";

export type DateRange = { from?: Date; to?: Date };

export type FiltersState = {
  dateRange: DateRange;
  platforms: string[];
  cities: string[];
  brand: string;
  skus: string[];
  dayparts: string[];
};

export const FILTER_OPTIONS = {
  platforms: ["Blinkit", "Zepto", "Instamart", "Amazon", "Flipkart"] as const,
  cities: ["Delhi", "Mumbai", "Bengaluru", "Pune", "Hyderabad"] as const,
  brands: ["ITC Master Chef"] as const,
  skus: ["Aloo Tikki 500g", "Veg Nuggets 500g", "Fries 750g"] as const,
  dayparts: ["Breakfast", "Lunch", "Snacks", "Dinner"] as const,
} as const;

const defaultDateRange: DateRange = {
  from: subDays(new Date(), 6),
  to: new Date(),
};

const defaultState: FiltersState = {
  dateRange: defaultDateRange,
  platforms: [...FILTER_OPTIONS.platforms],
  cities: [...FILTER_OPTIONS.cities],
  brand: FILTER_OPTIONS.brands[0],
  skus: [],
  dayparts: [...FILTER_OPTIONS.dayparts],
};

interface FiltersContextValue {
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  reset: () => void;
}

const FiltersContext = createContext<FiltersContextValue | undefined>(undefined);

export const FiltersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<FiltersState>(defaultState);

  const value = useMemo(() => ({
    filters,
    setFilters,
    reset: () => setFilters(defaultState),
  }), [filters]);

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error("useFilters must be used within FiltersProvider");
  return ctx;
}
