import { useFilters, FILTER_OPTIONS } from "@/context/FiltersContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarDays, Filter, CheckSquare, Building2, PackageOpen, Clock, SlidersHorizontal, RotateCcw } from "lucide-react";
import * as React from "react";

const MultiSelect: React.FC<{
  label: string;
  options: string[];
  values: string[];
  onChange: (next: string[]) => void;
  icon?: React.ReactNode;
}> = ({ label, options, values, onChange, icon }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="gap-2">
          {icon}
          {label}
          {values.length ? ` (${values.length})` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-56">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => (
          <DropdownMenuCheckboxItem
            key={opt}
            checked={values.includes(opt)}
            onCheckedChange={(checked) => {
              const next = checked ? [...values, opt] : values.filter(v => v !== opt);
              onChange(next);
            }}
          >
            {opt}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const GlobalFilters: React.FC = () => {
  const { filters, setFilters, reset } = useFilters();
  const [open, setOpen] = React.useState(false);

  const dateLabel = filters.dateRange.from && filters.dateRange.to
    ? `${format(filters.dateRange.from, "dd MMM")} – ${format(filters.dateRange.to, "dd MMM yyyy")}`
    : "Select range";

  return (
    <section aria-label="Global filters" className="w-full rounded-lg border bg-card p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-3">
        <div className="flex items-center gap-2 pr-2 text-muted-foreground">
          <Filter size={18} />
          <span className="text-sm">Filters</span>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2 w-full sm:w-auto">
              <CalendarDays size={18} />
              {dateLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={filters.dateRange.from}
              selected={filters.dateRange as any}
              onSelect={(range) => setFilters((f) => ({ ...f, dateRange: range ?? f.dateRange }))}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <MultiSelect
          label="Platforms"
          options={FILTER_OPTIONS.platforms}
          values={filters.platforms}
          onChange={(next) => setFilters((f) => ({ ...f, platforms: next }))}
          icon={<CheckSquare size={16} />}
        />

        <MultiSelect
          label="Cities"
          options={FILTER_OPTIONS.cities}
          values={filters.cities}
          onChange={(next) => setFilters((f) => ({ ...f, cities: next }))}
          icon={<Building2 size={16} />}
        />

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={filters.brand}
            onValueChange={(v) => setFilters((f) => ({ ...f, brand: v }))}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.brands.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" className="gap-2 w-full sm:w-auto">
              <SlidersHorizontal size={16} />
              More filters
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-80">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Advanced</div>
              <div className="flex flex-wrap gap-2">
                <MultiSelect
                  label="SKUs"
                  options={FILTER_OPTIONS.skus}
                  values={filters.skus}
                  onChange={(next) => setFilters((f) => ({ ...f, skus: next }))}
                  icon={<PackageOpen size={16} />}
                />
                <MultiSelect
                  label="Dayparts"
                  options={FILTER_OPTIONS.dayparts}
                  values={filters.dayparts}
                  onChange={(next) => setFilters((f) => ({ ...f, dayparts: next }))}
                  icon={<Clock size={16} />}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button 
          variant="outline" 
          onClick={reset} 
          className="gap-2 w-full sm:w-auto"
        >
          <RotateCcw size={16} />
          Reset
        </Button>
      </div>
    </section>
  );
};

export default GlobalFilters;
