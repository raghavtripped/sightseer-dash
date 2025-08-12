import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { routesByPersona, PersonaKey, appRoutes } from "@/routes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useFilters } from "@/context/FiltersContext";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  ChevronDown,
  Star,
  CheckCircle,
  AlertTriangle,
  Zap,
  Info as InfoIcon,
  Users,
  BarChart3,
  Briefcase,
  TrendingUp as TrendingUpIcon,
  Palette,
  Package,
  DollarSign,
  Database,
  ArrowRight,
} from "lucide-react";

const personaConfig: Record<PersonaKey, { icon: React.ReactNode; color: string; bgGradient: string; description: string }> = {
  "Performance Marketing": { 
    icon: <TrendingUpIcon className="w-5 h-5" />, 
    color: "text-blue-600", 
    bgGradient: "from-blue-50 to-blue-100/50",
    description: "Campaign performance & optimization"
  },
  "CMO / Leadership": { 
    icon: <Briefcase className="w-5 h-5" />, 
    color: "text-purple-600", 
    bgGradient: "from-purple-50 to-purple-100/50",
    description: "Executive insights & strategy"
  },
  "Brand / Category Manager": { 
    icon: <Star className="w-5 h-5" />, 
    color: "text-amber-600", 
    bgGradient: "from-amber-50 to-amber-100/50",
    description: "Brand & SKU performance"
  },
  "Creative / Content": { 
    icon: <Palette className="w-5 h-5" />, 
    color: "text-pink-600", 
    bgGradient: "from-pink-50 to-pink-100/50",
    description: "Creative assets & content"
  },
  "Supply Chain / Channel Ops": { 
    icon: <Package className="w-5 h-5" />, 
    color: "text-green-600", 
    bgGradient: "from-green-50 to-green-100/50",
    description: "Inventory & availability"
  },
  "Finance / FP&A": { 
    icon: <DollarSign className="w-5 h-5" />, 
    color: "text-indigo-600", 
    bgGradient: "from-indigo-50 to-indigo-100/50",
    description: "Budget & ROI tracking"
  },
  "Data / IT Admin": { 
    icon: <Database className="w-5 h-5" />, 
    color: "text-slate-600", 
    bgGradient: "from-slate-50 to-slate-100/50",
    description: "System health & integrations"
  },
};

// Types for enhanced UI elements
interface KPI {
  key: string;
  today: number;
  yday: number;
  fmt: (n: number) => string;
  icon?: React.ReactNode;
}

type TabKey =
  | "All"
  | "Favorites"
  | "Performance"
  | "CMO"
  | "Brand"
  | "Creative"
  | "Supply"
  | "Finance"
  | "Admin";

// Remove the full KPICard and use a compact version
const CompactKPICard = ({ kpi }) => {
  const delta = kpi.today - kpi.yday;
  const isPositive = delta >= 0;
  const percentage = kpi.yday ? ((delta / kpi.yday) * 100).toFixed(1) : "0.0";
  const trendColor = isPositive ? "text-emerald-600" : "text-red-500";
  const bgGradient = isPositive ? "from-emerald-50 to-emerald-100/50" : "from-red-50 to-red-100/50";
  return (
    <div className={`bg-gradient-to-br ${bgGradient} rounded-xl p-3 border border-white/20 shadow-sm hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          <div className={`p-1.5 rounded-md ${isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
            {kpi.icon}
          </div>
          <span className="text-xs font-medium text-muted-foreground">{kpi.key}</span>
        </div>
      </div>
      <div className="space-y-0.5">
        <div className="text-lg font-bold">{kpi.fmt(kpi.today)}</div>
        <div className={`flex items-center gap-1 text-[10px] ${trendColor}`}>
          {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          <span>{isPositive ? "+" : "-"}{Math.abs(Number(percentage)).toFixed(1)}%</span>
          <span className="text-muted-foreground">vs yesterday</span>
        </div>
      </div>
    </div>
  );
};


// Quick Stat card component
const CompactStatCard = ({ title, value, icon, trend, trendColor = "text-emerald-600" }) => (
  <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl p-3 border border-white/20 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-1">
        <div className="p-1.5 rounded-md bg-slate-100 text-slate-700">
          {icon}
        </div>
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
      </div>
    </div>
    <div className="space-y-0.5">
      <div className="text-lg font-bold">{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 text-[10px] ${trendColor}`}>
          <span>{trend}</span>
        </div>
      )}
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const kpis: KPI[] = [
    { key: "Conversions", today: 1420, yday: 1310, fmt: (n: number) => n.toLocaleString(), icon: <Users className="w-4 h-4" /> },
    { key: "Spend", today: 270000, yday: 255000, fmt: (n: number) => `₹${(n / 1000).toFixed(1)}k`, icon: <BarChart3 className="w-4 h-4" /> },
    { key: "ROAS", today: 4.6, yday: 4.3, fmt: (n: number) => `${n.toFixed(1)}×`, icon: <TrendingUp className="w-4 h-4" /> },
    { key: "CPA", today: 128, yday: 132, fmt: (n: number) => `₹${n}`, icon: <TrendingDown className="w-4 h-4" /> },
    { key: "NTB%", today: 41, yday: 39, fmt: (n: number) => `${n}%`, icon: <Users className="w-4 h-4" /> },
  ];
  const alerts = [
    { severity: "High", title: "OOS: Aloo Tikki 500g – Zepto Mumbai", entity: "3 campaigns", time: "12m", auto: "Auto-paused; est. ₹22k saved" },
    { severity: "Med", title: "Creative fatigue: Blinkit banner V2", entity: "Blinkit Delhi", time: "1h", auto: "Rotated to V3" },
    { severity: "Low", title: "API retry: Amazon product feed", entity: "Amazon IN", time: "2h", auto: "Recovered" },
  ];
  const savedViews = [
    { name: "Quick commerce snacks — Delhi", when: "2 days ago" },
    { name: "Amazon Sponsored – BLR", when: "5 days ago" },
  ];
  const recent = [
    { who: "AI", what: "Paused C-002", when: "10:05" },
    { who: "Raghav", what: "Shifted ₹50k to Blinkit Snacks", when: "09:48" },
  ];
  const isEmpty = false;
  const [openCommand, setOpenCommand] = React.useState<boolean>(false);



  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenCommand((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // UI components inspired by the provided design
  const KPICard: React.FC<{ kpi: KPI }> = ({ kpi }) => {
    const delta = kpi.today - kpi.yday;
    const isPositive = delta >= 0;
    const percentage = kpi.yday ? ((delta / kpi.yday) * 100).toFixed(1) : "0.0";
    const trendColor = isPositive ? "text-emerald-600" : "text-red-500";
    const bgGradient = isPositive ? "from-emerald-50 to-emerald-100/50" : "from-red-50 to-red-100/50";
    return (
      <div className={`bg-gradient-to-br ${bgGradient} backdrop-blur-sm rounded-2xl p-5 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300 group`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isPositive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
              {kpi.icon}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{kpi.key}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="text-xl font-bold">{kpi.fmt(kpi.today)}</div>
          <div className={`flex items-center gap-1 text-xs ${trendColor}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span className="font-medium">{isPositive ? "+" : "-"}{Math.abs(Number(percentage)).toFixed(1)}%</span>
            <span className="text-muted-foreground">vs yesterday</span>
          </div>
        </div>
      </div>
    );
  };

  const AlertCard: React.FC<{ a: (typeof alerts)[number] }> = ({ a }) => {
    const config = {
      High: { icon: <AlertTriangle className="w-4 h-4" />, color: "text-red-600", bg: "bg-red-50 border-red-200", badge: "bg-red-100 text-red-700" },
      Med: { icon: <Zap className="w-4 h-4" />, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700" },
      Low: { icon: <InfoIcon className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", badge: "bg-blue-100 text-blue-700" },
    } as const;
    const c = config[a.severity as keyof typeof config];
    return (
      <div className={`${c.bg} border rounded-xl p-4 cursor-pointer hover:shadow-sm transition-all duration-200 group`} onClick={() => navigate('/alerts-action-log')}>
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className={c.color}>{c.icon}</div>
            <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${c.badge}`}>{a.severity}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="space-y-1.5">
          <div className="font-medium text-sm">{a.title}</div>
          <div className="text-xs text-muted-foreground">{a.entity} • {a.time}</div>
          <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><CheckCircle className="w-3 h-3" />{a.auto}</div>
        </div>
      </div>
    );
  };

  const RoleCard: React.FC<{ persona: PersonaKey }> = ({ persona }) => {
    const config = personaConfig[persona];
    const routes = routesByPersona[persona] || [];
    
    return (
      <div className={`bg-gradient-to-br ${config.bgGradient} rounded-2xl border border-white/50 hover:shadow-lg transition-all duration-300 group`}>
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl bg-white/80 ${config.color} shadow-sm`}>
                {config.icon}
              </div>
              <div>
                <h3 className="font-semibold text-sm">{persona}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="w-full justify-between group-hover:shadow-sm" size="sm">
                  <span className="text-xs">{routes.length} dashboards available</span>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                {routes.map((route) => (
                  <DropdownMenuItem 
                    key={route.id} 
                    onClick={() => navigate(route.path)}
                    className="cursor-pointer py-2.5"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm">{route.title}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Synapse dashboard — ITC Performance Marketing</title>
        <meta name="description" content="AI-powered & agentic performance marketing dashboard for ITC Foods with role-based views and global filters." />
        <link rel="canonical" href="/" />
      </Helmet>
      <DashboardLayout title="AI-powered performance marketing" subtitle="Choose a view to begin.">
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {/* KPI grid with trends */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {kpis.map((k) => <CompactKPICard key={k.key} kpi={k} />)}
            <CompactStatCard 
              title="Active campaigns" 
              value="24" 
              icon={<Users className="w-4 h-4" />}
              trend="+2 vs last week"
              trendColor="text-emerald-600"
            />
            <CompactStatCard 
              title="Total spend (MTD)" 
              value="₹12.4L" 
              icon={<BarChart3 className="w-4 h-4" />}
              trend="+12% vs last month"
              trendColor="text-emerald-600"
            />
          </section>

          {/* Search and Navigation */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Navigate by Role</h2>
                <p className="text-sm text-muted-foreground mt-1">Select your role to access relevant dashboards</p>
              </div>
              <Button onClick={() => setOpenCommand(true)} variant="outline" className="gap-2">
                <Search className="w-4 h-4" />
                Search all dashboards
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.keys(personaConfig).map((persona) => (
                <RoleCard key={persona} persona={persona as PersonaKey} />
              ))}
            </div>

            {/* Quick Stats */}
            {/* This section is now handled by the grid above */}
          </section>

          {isEmpty && (
            <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">No data for these filters. Try expanding the date range.</div>
          )}

          <Separator className="my-2" />
          <footer className="flex items-center justify-between text-xs text-muted-foreground">
            <div>Data fresh as of 10:24 IST</div>
            <div className="flex items-center gap-3">
              {['Blinkit','Zepto','Instamart','Amazon','Flipkart'].map((p) => (
                <span key={p} className="inline-flex items-center gap-1 rounded-md bg-muted/40 px-2 py-1"><span className="h-2 w-2 rounded-full bg-green-500" /> {p}</span>
              ))}
            </div>
          </footer>
        </div>
        <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
          <CommandInput placeholder="Type to search dashboards…" />
          <CommandList>
            <CommandEmpty>No dashboards found.</CommandEmpty>
            {Object.entries(routesByPersona).map(([persona, routes]) => {
              const config = personaConfig[persona as PersonaKey];
              return (
                <CommandGroup key={persona} heading={persona}>
                  {routes.map((r) => (
                    <CommandItem 
                      key={r.id} 
                      value={`${r.title} ${persona}`} 
                      onSelect={() => { 
                        setOpenCommand(false); 
                        navigate(r.path); 
                      }}
                      className="cursor-pointer"
                    >
                      <div className={`mr-2 ${config.color}`}>
                        {React.cloneElement(config.icon as React.ReactElement, { className: "w-4 h-4" })}
                      </div>
                      <span>{r.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </CommandDialog>
      </DashboardLayout>
    </>
  );
};

export default Index;
