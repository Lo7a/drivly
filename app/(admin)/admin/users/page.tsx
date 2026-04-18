import { prisma } from "@/lib/prisma";
import { User, Shield, Mail, Phone } from "lucide-react";

async function getUsers() {
  try {
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { dealer: { select: { businessName: true, status: true } } },
    });
  } catch {
    return [];
  }
}

const ROLE_CONFIG: Record<string, { label: string; color: string }> = {
  ADMIN: { label: "אדמין", color: "bg-amber-500/10 text-amber-500" },
  DEALER: { label: "סוחר", color: "bg-cyan-500/10 text-cyan-500" },
};

export default async function AdminUsersPage() {
  const users = await getUsers();

  const stats = [
    { label: "סה״כ משתמשים", count: users.length, color: "border-border" },
    { label: "אדמינים", count: users.filter((u) => u.role === "ADMIN").length, color: "border-amber-500/20 bg-amber-500/5" },
    { label: "סוחרים", count: users.filter((u) => u.role === "DEALER").length, color: "border-cyan-500/20 bg-cyan-500/5" },
    { label: "פעילים", count: users.filter((u) => u.dealer?.status === "APPROVED").length, color: "border-emerald-500/20 bg-emerald-500/5" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">ניהול משתמשים</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, count, color }) => (
          <div key={label} className={`rounded-xl border p-4 text-center ${color}`}>
            <p className="text-2xl font-bold text-foreground">{count}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {users.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">אין משתמשים</p>
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground bg-muted/50">
                    <th className="text-start py-3 px-4 font-medium">שם</th>
                    <th className="text-start py-3 px-4 font-medium">אימייל</th>
                    <th className="text-start py-3 px-4 font-medium">טלפון</th>
                    <th className="text-start py-3 px-4 font-medium">תפקיד</th>
                    <th className="text-start py-3 px-4 font-medium">עסק</th>
                    <th className="text-start py-3 px-4 font-medium">הצטרף</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border hover:bg-accent transition-colors">
                      <td className="py-3 px-4 text-foreground font-medium">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                            {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                          </div>
                          {user.fullName}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground" dir="ltr">{user.email}</td>
                      <td className="py-3 px-4 text-muted-foreground" dir="ltr">{user.phone || "—"}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_CONFIG[user.role].color}`}>
                          {user.role === "ADMIN" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {ROLE_CONFIG[user.role].label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {user.dealer?.businessName || "—"}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {new Date(user.createdAt).toLocaleDateString("he-IL")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sm:hidden divide-y divide-border">
              {users.map((user) => (
                <div key={user.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                      {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground text-sm">{user.fullName}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${ROLE_CONFIG[user.role].color}`}>
                          {ROLE_CONFIG[user.role].label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1" dir="ltr">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </p>
                      {user.phone && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5" dir="ltr">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
