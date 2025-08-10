import React from "react";
import { GlobalFilters } from "@/components/GlobalFilters";
import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Activity } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  showFilters?: boolean;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, showFilters = true, title, subtitle }) => {
  const location = useLocation();
  const [spot, setSpot] = React.useState({ x: 50, y: 50 });

  return (
    <div className="min-h-screen bg-background">
      <header
        className="border-b bg-card/70 backdrop-blur supports-[backdrop-filter]:bg-card/60"
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
        <nav className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 ring-1 ring-primary/30" />
            <Link to="/" className="font-semibold">Synapse Dashboard</Link>
          </div>
          <div className="flex items-center gap-1">
            <NavLink to="/" icon={<Home size={16} />} active={location.pathname === "/"}>Home</NavLink>
            <NavLink to="/live-ops" icon={<Activity size={16} />} active={location.pathname.startsWith("/live-ops")}>Live Ops</NavLink>
          </div>
        </nav>
      </header>

      <main className="container py-6 space-y-4">
        {title && (
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        {showFilters && <GlobalFilters />}
        {children}
      </main>
    </div>
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
