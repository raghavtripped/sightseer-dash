import React from "react";
import { GlobalFilters } from "@/components/GlobalFilters";
import { useLocation, Link, NavLink as RRNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Activity } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar";
import { appRoutes, routesByPersona, PersonaKey } from "@/routes";
import MetricDefinitions from "@/components/MetricDefinitions";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
  hideSidebar?: boolean;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, showFilters = true, title, subtitle, hideSidebar = false }) => {
  const location = useLocation();
  const [spot, setSpot] = React.useState({ x: 50, y: 50 });

  return (
    <SidebarProvider>
      {!hideSidebar && (
        <Sidebar variant="inset">
          <SidebarContent>
            {Object.keys(routesByPersona).map((persona) => (
              <SidebarGroup key={persona}>
                <SidebarGroupLabel>{persona}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {routesByPersona[persona as PersonaKey].map((r) => (
                      <SidebarMenuItem key={r.id}>
                        <SidebarMenuButton asChild isActive={location.pathname === r.path}>
                          <RRNavLink to={r.path}>
                            <span>{r.title}</span>
                          </RRNavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
      )}
      <SidebarInset>
        <header
        className="sticky top-0 z-30 border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60"
        onMouseMove={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setSpot({ x, y });
        }}
        style={{
          backgroundImage: `radial-gradient(600px circle at ${spot.x}% ${spot.y}%, hsl(var(--primary)/0.10), transparent 60%)`,
          transition: 'background-image var(--transition-smooth, 150ms ease-out)'
        }}
      >
        <nav className="container flex items-center justify-between py-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 ring-1 ring-primary/30" />
            <Link to="/" className="font-semibold">Synapse dashboard</Link>
          </div>
          <div className="flex items-center gap-1">
            {!hideSidebar && <SidebarTrigger />}
            <div className="hidden sm:flex items-center gap-1">
              <NavLink to="/" icon={<Home size={16} />} active={location.pathname === "/"}>Home</NavLink>
              <NavLink to="/live-ops" icon={<Activity size={16} />} active={location.pathname.startsWith("/live-ops")}>Live ops</NavLink>
            </div>
          </div>
        </nav>
      </header>

      <main className="container py-4 sm:py-6 px-4 sm:px-6 space-y-4">
        {title && (
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        {showFilters && (
          <div className="space-y-2">
            <GlobalFilters />
            <div className="flex items-center justify-end">
              <MetricDefinitions />
            </div>
          </div>
        )}
        {children}
      </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

const NavLink: React.FC<{ to: string; icon?: React.ReactNode; active?: boolean; children: React.ReactNode }> = ({ to, icon, active, children }) => (
  <Link
    to={to}
    className={cn(
      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm ring-1 ring-transparent transition-colors",
      active
        ? "bg-secondary text-foreground ring-border"
        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
    )}
    aria-current={active ? "page" : undefined}
  >
    {icon}
    {children}
  </Link>
);

export default DashboardLayout;
