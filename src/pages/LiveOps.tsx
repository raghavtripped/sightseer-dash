import React from "react";
import { Helmet } from "react-helmet-async";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ExportBar from "@/components/ExportBar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { MoreHorizontal, Pause, Play, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CampaignRow {
  id: string;
  name: string;
  platform: string;
  status: "Active" | "Paused";
  spendToday: number;
  pacing: number; // % of plan
  impr: number;
  clicks: number;
  conv: number;
  roas: number;
  cpa: number;
  budgetLeft: number;
  mode: "AI" | "Manual";
}

const rows: CampaignRow[] = [
  { id: "C-001", name: "Blinkit | Snacks | Delhi", platform: "Blinkit", status: "Active", spendToday: 82000, pacing: 92, impr: 142000, clicks: 3500, conv: 410, roas: 6.2, cpa: 118, budgetLeft: 120000, mode: "AI" },
  { id: "C-002", name: "Zepto | Late Night | Mumbai", platform: "Zepto", status: "Active", spendToday: 54000, pacing: 76, impr: 103400, clicks: 2600, conv: 240, roas: 4.1, cpa: 132, budgetLeft: 80000, mode: "AI" },
  { id: "C-003", name: "Instamart | Breakfast | BLR", platform: "Instamart", status: "Paused", spendToday: 12000, pacing: 35, impr: 22000, clicks: 540, conv: 40, roas: 2.9, cpa: 168, budgetLeft: 45000, mode: "Manual" },
  { id: "C-004", name: "Amazon | Sponsored | IN", platform: "Amazon", status: "Active", spendToday: 63000, pacing: 83, impr: 165000, clicks: 4200, conv: 380, roas: 3.8, cpa: 145, budgetLeft: 100000, mode: "Manual" },
  { id: "C-005", name: "Flipkart | Promo | Pune", platform: "Flipkart", status: "Active", spendToday: 28000, pacing: 64, impr: 66000, clicks: 1500, conv: 130, roas: 4.4, cpa: 126, budgetLeft: 60000, mode: "AI" },
  { id: "C-006", name: "Blinkit | Dinner | Hyd", platform: "Blinkit", status: "Active", spendToday: 41000, pacing: 98, impr: 88000, clicks: 2100, conv: 220, roas: 5.5, cpa: 121, budgetLeft: 52000, mode: "AI" },
];

const currency = (n: number) => `₹${(n/1000).toFixed(1)}k`;

const LiveOps: React.FC = () => {
  const { toast } = useToast();
  const conversionsToday = 1420;
  const conversionsYesterday = 1310;
  const diff = conversionsToday - conversionsYesterday;

  const act = (label: string, row: CampaignRow) => () => toast({
    title: `${label} queued`,
    description: `${row.id} — ${row.name}`,
  });

  return (
    <>
      <Helmet>
        <title>Live Ops Console – AI Performance Marketing</title>
        <meta name="description" content="Real-time pacing, delivery and on-target spend with quick actions for campaigns across Blinkit, Zepto, Instamart, Amazon and Flipkart." />
        <link rel="canonical" href="/live-ops" />
      </Helmet>

      <DashboardLayout title="Live Ops Console" subtitle="Pacing, delivery, and on-target spend right now.">
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversions (Today vs Yesterday)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <div className="text-2xl font-semibold">{conversionsToday.toLocaleString()}</div>
              <div className={diff >= 0 ? "text-success" : "text-destructive"}>
                {diff >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
              </div>
              <div className="text-sm text-muted-foreground">{diff >= 0 ? "+" : ""}{diff}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Budget Burn (Today)</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-3">
              <DollarSign size={18} className="text-muted-foreground" />
              <div className="text-2xl font-semibold">₹2.7L</div>
              <div className="text-sm text-muted-foreground">of ₹3.0L plan</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Mode</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-md bg-success/10 px-2 py-1 text-success ring-1 ring-success/20">AI Majority</span>
              <span>·</span>
              <span>Overrides allowed</span>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Campaigns</h2>
            <ExportBar />
          </div>

          <div className="overflow-hidden rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="hidden md:table-cell">Platform</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Spend today</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Pacing %</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Impr</TableHead>
                  <TableHead className="hidden lg:table-cell text-right">Clicks</TableHead>
                  <TableHead className="text-right">Conv</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead className="hidden md:table-cell text-right">CPA</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Budget left</TableHead>
                  <TableHead className="w-10"> </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{r.platform}</TableCell>
                    <TableCell>
                      <span className={
                        r.status === 'Active'
                          ? 'rounded-md bg-success/10 px-2 py-1 text-xs text-success ring-1 ring-success/20'
                          : 'rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground'
                      }>
                        {r.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{currency(r.spendToday)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-right">{r.pacing}%</TableCell>
                    <TableCell className="hidden lg:table-cell text-right">{r.impr.toLocaleString()}</TableCell>
                    <TableCell className="hidden lg:table-cell text-right">{r.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{r.conv.toLocaleString()}</TableCell>
                    <TableCell className={"text-right " + (r.roas >= 4 ? "text-success" : "text-destructive")}>
                      {r.roas.toFixed(1)}x
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right">₹{r.cpa}</TableCell>
                    <TableCell className="hidden md:table-cell text-right">{currency(r.budgetLeft)}</TableCell>
                    <TableCell className="text-right">
                      <RowActions row={r} onAct={act} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </DashboardLayout>
    </>
  );
};

const RowActions: React.FC<{ row: CampaignRow; onAct: (label: string, row: CampaignRow) => () => void }> = ({ row, onAct }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Actions for campaign">
          <MoreHorizontal size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {row.status === 'Active' ? (
          <DropdownMenuItem onClick={onAct("Pause", row)}>
            <Pause className="mr-2" size={16} /> Pause
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onAct("Resume", row)}>
            <Play className="mr-2" size={16} /> Resume
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onAct("Bid -", row)}>- Bid</DropdownMenuItem>
        <DropdownMenuItem onClick={onAct("Bid +", row)}>+ Bid</DropdownMenuItem>
        <DropdownMenuItem onClick={onAct("Cap", row)}>Set Cap</DropdownMenuItem>
        <DropdownMenuItem onClick={onAct("Switch creative", row)}>Switch Creative</DropdownMenuItem>
        <DropdownMenuItem onClick={onAct("Shift budget", row)}>Shift Budget</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LiveOps;
