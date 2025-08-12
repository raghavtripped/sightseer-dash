import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { routesByPersona, PersonaKey, appRoutes } from "@/routes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFilters } from "@/context/FiltersContext";
import {
  Search,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Star,
  CheckCircle,
  AlertTriangle,
  Zap,
  Info as InfoIcon,
  Users,
  BarChart3,
} from "lucide-react";

const personas: PersonaKey[] = [
  "Performance Marketing",
  "CMO / Leadership",
  "Brand / Category Manager",
  "Creative / Content",
  "Supply Chain / Channel Ops",
  "Finance / FP&A",
  "Data / IT Admin",
];

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
  const [activeTab, setActiveTab] = React.useState<TabKey>("All");
  const [queryText, setQueryText] = React.useState<string>("");
  const [showCount, setShowCount] = React.useState<number>(8);
  const [favorites, setFavorites] = React.useState<number[]>(() => {
    try {
      const raw = localStorage.getItem("synapse:favorites");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  React.useEffect(() => {
    try {
      localStorage.setItem("synapse:favorites", JSON.stringify(favorites));
    } catch {
      void 0;
    }
  }, [favorites]);

  const tabToPersona = React.useMemo<Record<Exclude<TabKey, "All">, PersonaKey | "Favorites">>(
    () => ({
      Favorites: "Favorites",
      Performance: "Performance Marketing",
      CMO: "CMO / Leadership",
      Brand: "Brand / Category Manager",
      Creative: "Creative / Content",
      Supply: "Supply Chain / Channel Ops",
      Finance: "Finance / FP&A",
      Admin: "Data / IT Admin",
    }),
    []
  );

  const filteredRoutes = React.useMemo(() => {
    const base = activeTab === "Favorites"
      ? appRoutes.filter((r) => favorites.includes(r.id))
      : activeTab === "All"
        ? appRoutes
        : (routesByPersona[tabToPersona[activeTab] as PersonaKey] || []);
    const q = queryText.trim().toLowerCase();
    return base.filter((r) => !q || r.title.toLowerCase().includes(q) || r.persona.toLowerCase().includes(q));
  }, [activeTab, favorites, queryText, tabToPersona]);

  const tabs: { key: TabKey; label: string; count?: number }[] = React.useMemo(() => [
    { key: "All", label: "All Views", count: appRoutes.length },
    { key: "Favorites", label: "Favorites", count: favorites.length },
    { key: "Performance", label: "Performance" },
    { key: "CMO", label: "Leadership" },
    { key: "Brand", label: "Brand" },
    { key: "Creative", label: "Creative" },
    { key: "Supply", label: "Supply" },
    { key: "Finance", label: "Finance" },
    { key: "Admin", label: "Admin" },
  ], [favorites.length]);

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

  const TabButton: React.FC<{ tab: { key: TabKey; label: string; count?: number }; isActive: boolean; onClick: (k: TabKey) => void }> = ({ tab, isActive, onClick }) => (
    <button
      onClick={() => onClick(tab.key)}
      className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 inline-flex items-center gap-2 ${isActive ? "bg-foreground text-background shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
      aria-pressed={isActive}
    >
      {tab.label}
      {typeof tab.count === 'number' && (
        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isActive ? "bg-background/20 text-background" : "bg-muted/60 text-muted-foreground"}`}>{tab.count}</span>
      )}
    </button>
  );

  const ViewCard: React.FC<{ v: (typeof appRoutes)[number]; isFavorite: boolean; onToggle: (id: number) => void; onOpen: () => void }> = ({ v, isFavorite, onToggle, onOpen }) => (
    <div className="bg-card rounded-2xl border hover:border-border hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="inline-flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted/60">{v.persona}</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(v.id); }}
            className={`p-1.5 rounded-lg transition-all duration-200 ${isFavorite ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            aria-pressed={isFavorite}
          >
            <Star className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        </div>
        <div className="space-y-2 mb-4">
          <div className="font-semibold text-sm">{v.title}</div>
          <div className="text-xs text-muted-foreground">Quick-launch this dashboard</div>
        </div>
        <Button className="w-full" size="sm" onClick={onOpen}>Open</Button>
      </div>
    </div>
  );

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <>
      <Helmet>
        <title>Synapse dashboard — ITC Performance Marketing</title>
        <meta name="description" content="AI-powered & agentic performance marketing dashboard for ITC Foods with role-based views and global filters." />
        <link rel="canonical" href="/" />
      </Helmet>
      <DashboardLayout title="AI-powered performance marketing" subtitle="Choose a view to begin." hideSidebar>
        <div className="max-w-7xl mx-auto px-6 space-y-8">
          {/* KPI grid with trends */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {kpis.map((k) => (
              <KPICard key={k.key} kpi={k} />
            ))}
          </section>

          {/* Two-pane layout */}
          <section className="grid grid-cols-12 gap-6">
            {/* Main: Views launcher */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              <Card className="rounded-2xl">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm">Your Dashboards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {tabs.map((t) => (
                        <TabButton key={t.key} tab={t} isActive={activeTab === t.key} onClick={setActiveTab} />
                      ))}
                    </div>
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        placeholder="Search dashboards…"
                        className="h-8 w-56 rounded-md border bg-background pl-8 pr-2 text-sm"
                        value={queryText}
                        onChange={(e) => setQueryText(e.target.value)}
                        aria-label="Search dashboards"
                      />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRoutes.slice(0, showCount).map((v) => (
                      <ViewCard
                        key={v.id}
                        v={v}
                        isFavorite={favorites.includes(v.id)}
                        onToggle={toggleFavorite}
                        onOpen={() => navigate(v.path)}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    {showCount < filteredRoutes.length && (
                      <button className="text-xs rounded-md border px-3 py-1" onClick={() => setShowCount((n) => n + 8)}>Show 8 more</button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar stack */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <Card className="rounded-2xl">
                <CardHeader className="pb-2 flex items-center justify-between">
                  <CardTitle className="text-sm">Top alerts (24h)</CardTitle>
                  <Button size="sm" variant="ghost" onClick={() => navigate('/alerts-action-log')}>Open log</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {alerts.slice(0, 3).map((a, i) => (
                    <AlertCard key={i} a={a} />
                  ))}
                  {alerts.length > 3 && (
                    <button className="text-xs rounded-md border px-3 py-1">View all alerts</button>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Quick stats</CardTitle></CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Active campaigns</span><span className="font-medium">24</span></div>
                   <div className="flex items-center justify-between"><span className="text-muted-foreground">Total spend (MTD)</span><span className="font-medium">₹12.4L</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Avg. ROAS</span><span className="font-medium text-emerald-600">4.2×</span></div>
                  <div className="flex items-center justify-between"><span className="text-muted-foreground">Platforms connected</span><span className="font-medium">5</span></div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Saved views</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {savedViews.map((s) => (
                    <div key={s.name} className="flex items-center justify-between">
                      <span>{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.when}</span>
                    </div>
                  ))}
                  <div className="pt-2">
                    <Button size="sm" variant="outline">Create saved view</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="pb-2"><CardTitle className="text-sm">Recent activity</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {recent.map((r, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span>{r.who}: {r.what}</span>
                      <span className="text-xs text-muted-foreground">{r.when}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
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
      </DashboardLayout>
    </>
  );
};

export default Index;

const PersonaSection: React.FC<{ persona: PersonaKey }> = ({ persona }) => {
  const navigate = useNavigate();
  const routes = routesByPersona[persona] || [];
  return (
    <section className="space-y-3">
      <div className="text-sm font-semibold text-muted-foreground">{persona}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((v) => (
          <Card
            key={v.id}
            className="transition hover:shadow-md cursor-pointer"
            role="button"
            onClick={() => navigate(v.path)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{v.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground flex items-center justify-between">
              <span>{persona}</span>
              <span className="rounded-md bg-secondary px-2 py-1">Open</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
