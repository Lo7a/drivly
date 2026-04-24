"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { LeadForm } from "@/components/shared/LeadForm";
import { formatPhone } from "@/lib/format";

type LeadType = "CALL" | "FINANCE" | "INSURANCE";

interface Props {
  carId: string;
  dealerId: string;
  dealerPhone: string;
  dealerName: string;
  carTitle: string;
}

export function CarContactPanel({
  carId,
  dealerId,
  dealerPhone,
  dealerName,
  carTitle,
}: Props) {
  const [activeTab, setActiveTab] = useState<LeadType>("CALL");
  const showDealerPhone = activeTab === "CALL";

  return (
    <div className="space-y-4">
      <LeadForm
        carId={carId}
        dealerId={dealerId}
        dealerPhone={dealerPhone}
        carTitle={carTitle}
        onTabChange={setActiveTab}
      />

      {/* Dealer phone only visible in CALL context */}
      {showDealerPhone && dealerPhone && (
        <div className="rounded-2xl border border-border bg-card p-5 text-center">
          <p className="text-sm text-muted-foreground mb-1">רוצה לדבר עכשיו?</p>
          <p className="text-xs text-muted-foreground mb-3">
            התקשר ישירות ל{dealerName}
          </p>
          <a
            href={`tel:${dealerPhone}`}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-400 w-full justify-center"
          >
            <Phone className="h-4 w-4" />
            {formatPhone(dealerPhone)}
          </a>
        </div>
      )}
    </div>
  );
}
