import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { routesByPersona, PersonaKey, appRoutes } from "@/routes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useFilters } from "@/context/FiltersContext";

const personas: PersonaKey[] = [
  "Performance Marketing",
  "CMO / Leadership",
  "Brand / Category Manager",
  "Creative / Content",
  "Supply Chain / Channel Ops",
  "Finance / FP&A",
  "Data / IT Admin",
];

const Index = () => {
  const navigate = useNavigate();
  const { filters } = useFilters();
  const kpis = [
    { key: "Conversions", today: 1420, yday: 1310, fmt: (n: number) => n.toLocaleString() },
    { key: "Spend", today: 270000, yday: 255000, fmt: (n: number) => `₹${(n/1000).toFixed(1)}k` },
    { key: "ROAS", today: 4.6, yday: 4.3, fmt: (n: number) => `${n.toFixed(1)}x` },
    { key: "CPA", today: 128, yday: 132, fmt: (n: number) => `₹${n}` },
    { key: "NTB%", today: 41, yday: 39, fmt: (n: number) => `${n}%` },
  ];
  const alerts = [
    { severity: "High", title: "OOS: Aloo Tikki 500g – Zepto Mumbai", entity: "3 campaigns", time: "12m", auto: "Auto-paused; est. ₹22k saved" },
    { severity: "Med", title: "Creative fatigue: Blinkit banner V2", entity: "Blinkit Delhi", time: "1h", auto: "Rotated to V3" },
    { severity: "Low", title: "API retry: Amazon product feed", entity: "Amazon IN", time: "2h", auto: "Recovered" },
  ];
  const savedViews = [
    { name: "Q-comm Snacks Delhi", when: "2d ago" },
    { name: "Amazon Sponsored – BLR", when: "5d ago" },
  ];
  const recent = [
    { who: "AI", what: "Paused C-002", when: "10:05" },
    { who: "Raghav", what: "Shifted ₹50k to Blinkit Snacks", when: "09:48" },
  ];
  const isEmpty = false;
  const [activeTab, setActiveTab] = React.useState<string>("Performance");
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
    } catch {}
  }, [favorites]);

  const tabToPersona: Record<string, PersonaKey | "Favorites" | "All"> = {
    Favorites: "Favorites",
    Performance: "Performance Marketing",
    CMO: "CMO / Leadership",
    Brand: "Brand / Category Manager",
    Creative: "Creative / Content",
    Supply: "Supply Chain / Channel Ops",
    Finance: "Finance / FP&A",
    Admin: "Data / IT Admin",
  };

  const filteredRoutes = React.useMemo(() => {
    const base = activeTab === "Favorites"
      ? appRoutes.filter((r) => favorites.includes(r.id))
      : activeTab in tabToPersona
        ? (routesByPersona[tabToPersona[activeTab] as PersonaKey] || [])
        : appRoutes;
    const q = queryText.trim().toLowerCase();
    return base.filter((r) => !q || r.title.toLowerCase().includes(q));
  }, [activeTab, favorites, queryText]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <>
      <Helmet>
        <title>Synapse Dashboard – ITC Performance Marketing</title>
        <meta name="description" content="AI-powered & agentic performance marketing dashboard for ITC Foods with role-based views and global filters." />
        <link rel="canonical" href="/" />
      </Helmet>
      <DashboardLayout title="AI-Powered Performance Marketing" subtitle="Choose a view to begin." hideSidebar>
        <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* KPI strip */}
        <section className="grid grid-cols-5 gap-4">
          {kpis.map((k) => {
            const delta = k.today - k.yday;
            const positive = delta >= 0;
            return (
              <Card key={k.key} className="h-24 rounded-2xl">
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs text-muted-foreground font-normal">{k.key} (today vs yday)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{k.fmt(k.today)}</div>
                  <div className={`text-xs ${positive ? "text-success" : "text-destructive"}`}>{positive ? "+" : "-"}{k.fmt(Math.abs(delta))}</div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Two-pane */}
        <section className="grid grid-cols-12 gap-6">
          {/* Main: Views launcher */}
          <div className="col-span-12 lg:col-span-8 space-y-3">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Views</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2 text-xs">
                    {['Favorites','Performance','CMO','Brand','Creative','Supply','Finance','Admin'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTab(t)}
                        className={`rounded-md px-2 py-1 ${activeTab === t ? 'bg-secondary' : 'bg-muted/40 hover:bg-muted'}`}
                        aria-pressed={activeTab === t}
                      >{t}</button>
                    ))}
                  </div>
                  <input
                    placeholder="Find a view…"
                    className="h-8 w-56 rounded-md border bg-background px-2 text-sm"
                    value={queryText}
                    onChange={(e) => setQueryText(e.target.value)}
                    aria-label="Find a view"
                  />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredRoutes.slice(0, showCount).map((v) => (
                    <Card key={v.id} className="rounded-xl">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{v.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-xs text-muted-foreground space-y-2">
                        <div className="inline-flex items-center gap-2"><span className="rounded-md bg-muted/40 px-2 py-0.5">{v.persona}</span></div>
                        <div className="flex items-center justify-between">
                          <Button size="sm" onClick={() => navigate(v.path)}>Open</Button>
                          <Button size="sm" variant="outline" onClick={() => toggleFavorite(v.id)} aria-pressed={favorites.includes(v.id)}>{favorites.includes(v.id) ? '★' : '☆'}</Button>
                        </div>
                      </CardContent>
                    </Card>
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
              <CardContent className="space-y-2">
                {alerts.slice(0,3).map((a, i) => (
                  <div key={i} className="rounded-md border p-3 text-sm cursor-pointer" onClick={() => navigate('/alerts-action-log')}>
                    <div className="flex items-center gap-2">
                      <Badge variant={a.severity === 'High' ? 'destructive' : a.severity === 'Med' ? 'secondary' : 'outline'}>{a.severity}</Badge>
                      <div className="font-medium">{a.title}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{a.entity} • {a.time} • {a.auto}</div>
                  </div>
                ))}
                {alerts.length > 3 && (
                  <button className="text-xs rounded-md border px-3 py-1">View all alerts</button>
                )}
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
          <div className="rounded-md border bg-card p-4 text-sm text-muted-foreground">No data for filters. Try expanding date range.</div>
        )}

        <Separator className="my-2" />
        <footer className="flex items-center justify-between text-xs text-muted-foreground">
          <div>Data fresh as of 10:24 Asia/Kolkata</div>
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
