"use client";

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface Props {
  leadsByDay: { date: string; count: number }[];
  leadsByType: { name: string; value: number; color: string }[];
  topCars: { name: string; views: number; leads: number }[];
  topDealers: { name: string; cars: number; views: number }[];
}

export function AnalyticsCharts({ leadsByDay, leadsByType, topCars, topDealers }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Leads over time */}
      <div className="rounded-2xl border border-border bg-card p-5 col-span-full">
        <h3 className="text-sm font-bold text-foreground mb-4">לידים ב-30 ימים אחרונים</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={leadsByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#0891b2"
              strokeWidth={2.5}
              dot={{ fill: "#0891b2", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leads by type */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">לידים לפי סוג</h3>
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={leadsByType}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
            >
              {leadsByType.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Top cars */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h3 className="text-sm font-bold text-foreground mb-4">רכבים פופולריים</h3>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={topCars} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={100} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="views" fill="#0891b2" name="צפיות" radius={[0, 4, 4, 0]} />
            <Bar dataKey="leads" fill="#10b981" name="לידים" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top dealers */}
      <div className="rounded-2xl border border-border bg-card p-5 col-span-full">
        <h3 className="text-sm font-bold text-foreground mb-4">סוחרים מובילים</h3>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={topDealers}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="cars" fill="#0891b2" name="רכבים" radius={[4, 4, 0, 0]} />
            <Bar dataKey="views" fill="#8b5cf6" name="צפיות" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
