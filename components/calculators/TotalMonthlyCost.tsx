"use client";

import { useState } from "react";
import { Calculator, Shield, Fuel, TrendingDown } from "lucide-react";
import { calculateFinance, estimateInsurance, estimateFuelCost, calculateTotalMonthlyCost } from "@/lib/calculators";
import { formatPrice } from "@/lib/format";

interface TotalMonthlyCostProps {
  carPrice: number;
  carYear: number;
  fuelConsumption: number; // km per liter
  fuelType: string;
}

export function TotalMonthlyCostCard({ carPrice, carYear, fuelConsumption, fuelType }: TotalMonthlyCostProps) {
  const [downPayment, setDownPayment] = useState(Math.round(carPrice * 0.2));
  const [months, setMonths] = useState(48);
  const [driverAge, setDriverAge] = useState(30);

  const finance = calculateFinance({
    carPrice,
    downPayment,
    months,
    annualRate: 4.5,
  });

  const insurance = estimateInsurance({
    carYear,
    carPrice,
    driverAge,
    youngDriver: driverAge < 24,
  });

  const fuel = estimateFuelCost({
    fuelConsumptionKmPerLiter: fuelConsumption || 14,
  });

  const total = calculateTotalMonthlyCost(finance, insurance, fuel);

  const isElectric = fuelType === "ELECTRIC";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        כמה זה עולה באמת?
      </h3>

      {/* Sliders */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">מקדמה</span>
            <span className="font-semibold">{formatPrice(downPayment)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={carPrice * 0.5}
            step={5000}
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">תקופה</span>
            <span className="font-semibold">{months} חודשים</span>
          </div>
          <input
            type="range"
            min={12}
            max={84}
            step={12}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">גיל נהג</span>
            <span className="font-semibold">{driverAge}</span>
          </div>
          <input
            type="range"
            min={17}
            max={70}
            step={1}
            value={driverAge}
            onChange={(e) => setDriverAge(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 mb-5">
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Calculator className="h-3.5 w-3.5 text-cyan-500" />
              מימון חודשי
            </span>
            <span className="font-semibold">{formatPrice(finance.monthlyPayment)}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (finance.monthlyPayment / total.total) * 100)}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-emerald-500" />
              ביטוח חודשי
            </span>
            <span className="font-semibold">{formatPrice(insurance.monthlyEstimate)}</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (insurance.monthlyEstimate / total.total) * 100)}%` }}
            />
          </div>
        </div>

        {!isElectric && (
          <div>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Fuel className="h-3.5 w-3.5 text-amber-500" />
                דלק חודשי
              </span>
              <span className="font-semibold">{formatPrice(fuel.monthlyCost)}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (fuel.monthlyCost / total.total) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">סה&quot;כ עלות חודשית</p>
          <p className="text-xs text-muted-foreground mt-0.5">כולל מימון + ביטוח{!isElectric ? " + דלק" : ""}</p>
        </div>
        <p className="text-3xl font-bold text-primary">{formatPrice(total.total)}</p>
      </div>
    </div>
  );
}
