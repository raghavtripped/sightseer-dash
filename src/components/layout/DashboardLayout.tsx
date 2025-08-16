import React from "react";
import { GlobalFilters } from "@/components/GlobalFilters";
import { useLocation, Link, NavLink as RRNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Activity } from "lucide-react";
import { Sidebar, SidebarContent, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
    <SidebarProvider defaultOpen={false}>
      {!hideSidebar && (
        <Sidebar variant="inset">
          <SidebarContent>
            <Accordion type="single" collapsible className="px-2">
              {Object.keys(routesByPersona).map((persona) => (
                <AccordionItem key={persona} value={persona} className="border-none">
                  <AccordionTrigger className="px-2 text-xs text-muted-foreground">
                    {persona}
                  </AccordionTrigger>
                  <AccordionContent className="pt-0">
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
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
        <nav className="container flex items-center justify-between py-2 sm:py-3 px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {!hideSidebar && <SidebarTrigger />}
            <img 
              src="/10820326.png" 
              alt="Synapse Logo" 
              className="h-6 w-6 sm:h-8 sm:w-8 rounded-md object-cover flex-shrink-0"
            />
            <Link to="/" className="font-semibold text-sm sm:text-base truncate">Synapse dashboard</Link>
          </div>
          <div className="flex items-center gap-1">
            <div className="hidden sm:flex items-center gap-1">
              <NavLink to="/" icon={<Home size={16} />} active={location.pathname === "/"}>Home</NavLink>
              <NavLink to="/live-ops" icon={<Activity size={16} />} active={location.pathname.startsWith("/live-ops")}>Live ops</NavLink>
            </div>
          </div>
        </nav>
      </header>

      <main className="container py-3 sm:py-4 lg:py-6 px-3 sm:px-4 lg:px-6 space-y-3 sm:space-y-4">
        {title && (
          <div className="space-y-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight">{title}</h1>
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
      
      <footer className="border-t bg-card/50 py-3 sm:py-4 mt-6 sm:mt-8">
        <div className="container px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-center">
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              Created by{" "}
              <a 
                href="https://raghavtripathi.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                Raghav Tripathi
              </a>
            </p>
          </div>
        </div>
      </footer>
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
