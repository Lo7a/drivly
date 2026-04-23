"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Phone, Calculator, Shield, TrendingUp } from "lucide-react";

interface Props {
  leadsByDay: { date: string; count: number }[];
  leadsByType: { name: string; value: number; color: string }[];
  topCars: { name: string; views: number; leads: number }[];
  topDealers: { name: string; cars: number; views: number }[];
}

const TYPE_META: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  "התקשרות": { icon: Phone, color: "#f59e0b", bg: "bg-amber-500/10 text-amber-500" },
  "מימון": { icon: Calculator, color: "#06b6d4", bg: "bg-cyan-500/10 text-cyan-500" },
  "ביטוח": { icon: Shield, color: "#10b981", bg: "bg-emerald-500/10 text-emerald-500" },
};

interface TooltipEntry {
  color?: string;
  name?: string | number;
  value?: string | number;
}

function ChartTooltip(props: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  unit?: string;
}) {
  const { active, payload, label, unit } = props;
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-xl border border-border bg-card/95 backdrop-blur shadow-lg p-3 text-xs"
      dir="rtl"
    >
      {label !== undefined && <p className="font-semibold text-foreground mb-2">{label}</p>}
      <div className="space-y-1">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-bold text-foreground tabular-nums">
              {entry.value}
              {unit && <span className="text-muted-foreground text-[10px] ms-0.5">{unit}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsCharts({
  leadsByDay,
  leadsByType,
  topCars,
  topDealers,
}: Props) {
  const totalLeadsInPeriod = leadsByType.reduce((s, t) => s + t.value, 0);
  const peakDay = leadsByDay.reduce(
    (max, d) => (d.count > max.count ? d : max),
    { date: "", count: 0 }
  );
  const maxCarMetric = Math.max(
    1,
    ...topCars.flatMap((c) => [c.views, c.leads * 8]) // scale leads visually
  );
  const maxDealerViews = Math.max(1, ...topDealers.map((d) => d.views));

  return (
    <div className="space-y-5">
      {/* ── Leads over time — featured area chart ── */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
          <div>
            <h3 className="text-base font-bold text-foreground">לידים ב-30 הימים האחרונים</h3>
            <p className="text-xs text-muted-foreground mt-1">
              סה״כ {totalLeadsInPeriod} פניות · שיא ביום {peakDay.date} ({peakDay.count})
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 text-[11px] font-semibold">
            <TrendingUp className="h-3 w-3" />
            30 ימים
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={leadsByDay} margin={{ top: 5, right: 8, left: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeDasharray="2 4"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              fontSize={10}
              tick={{ fill: "currentColor", fillOpacity: 0.5 }}
              interval="preserveStartEnd"
              reversed
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              fontSize={11}
              tick={{ fill: "currentColor", fillOpacity: 0.5 }}
              allowDecimals={false}
              width={30}
            />
            <Tooltip content={<ChartTooltip unit="לידים" />} cursor={{ stroke: "#06b6d4", strokeOpacity: 0.2, strokeWidth: 40 }} />
            <Area
              type="monotone"
              dataKey="count"
              name="לידים"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#leadsGradient)"
              activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── Leads by type — donut + legend ── */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="text-base font-bold text-foreground mb-5">פילוח לפי סוג</h3>

          {leadsByType.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
              אין עדיין נתונים
            </div>
          ) : (
            <>
              <div className="relative h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadsByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {leadsByType.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-3xl font-black text-foreground tabular-nums">
                    {totalLeadsInPeriod}
                  </p>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                    סה״כ
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {leadsByType.map((entry) => {
                  const pct = totalLeadsInPeriod > 0 ? Math.round((entry.value / totalLeadsInPeriod) * 100) : 0;
                  const meta = TYPE_META[entry.name];
                  const Icon = meta?.icon;
                  return (
                    <div key={entry.name} className="flex items-center gap-3">
                      {Icon && (
                        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta.bg} shrink-0`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground">{entry.name}</span>
                          <span className="text-muted-foreground tabular-nums">
                            <span className="font-semibold text-foreground">{entry.value}</span>
                            <span className="text-xs ms-1">({pct}%)</span>
                          </span>
                        </div>
                        <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: entry.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── Top cars — custom RTL horizontal bars ── */}
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <h3 className="text-base font-bold text-foreground mb-5">רכבים פופולריים</h3>

          {topCars.length === 0 ? (
            <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
              אין עדיין נתונים
            </div>
          ) : (
            <div className="space-y-4">
              {topCars.map((car, i) => {
                const viewPct = (car.views / maxCarMetric) * 100;
                const leadPct = ((car.leads * 8) / maxCarMetric) * 100;
                return (
                  <div key={i} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground/60 w-4 tabular-nums">
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-foreground truncate">
                          {car.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs shrink-0 ms-3">
                        <span className="text-cyan-600 dark:text-cyan-400 font-semibold tabular-nums">
                          {car.views}
                          <span className="text-[10px] text-muted-foreground ms-0.5">צפיות</span>
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                          {car.leads}
                          <span className="text-[10px] text-muted-foreground ms-0.5">לידים</span>
                        </span>
                      </div>
                    </div>

                    {/* Views bar */}
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-1">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-cyan-500 to-cyan-400 transition-all"
                        style={{ width: `${viewPct}%` }}
                      />
                    </div>
                    {/* Leads bar */}
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-emerald-500 to-emerald-400 transition-all"
                        style={{ width: `${leadPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-3 mt-2 border-t border-border">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-4 rounded-full bg-cyan-500" />
                  צפיות
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-4 rounded-full bg-emerald-500" />
                  לידים (מוגדל ×8 לקריאות)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Top dealers — clean bar chart ── */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-foreground">סוחרים מובילים</h3>
          <p className="text-xs text-muted-foreground">
            לפי מספר צפיות בכל הרכבים
          </p>
        </div>

        {topDealers.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
            אין עדיין נתונים
          </div>
        ) : (
          <div className="space-y-3">
            {topDealers.map((dealer, i) => {
              const pct = (dealer.views / maxDealerViews) * 100;
              return (
                <div key={dealer.name + i} className="flex items-center gap-4">
                  <div className="flex items-center gap-3 w-44 shrink-0">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 text-xs font-bold">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {dealer.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {dealer.cars} {dealer.cars === 1 ? "רכב" : "רכבים"}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-violet-500 via-violet-400 to-fuchsia-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  <div className="w-20 text-end shrink-0">
                    <p className="text-sm font-bold text-foreground tabular-nums">
                      {dealer.views.toLocaleString("he-IL")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">צפיות</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
