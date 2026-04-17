import { DEFAULT_FUEL_PRICE_PER_LITER, DEFAULT_MONTHLY_KM } from "./constants";

// ─── Finance Calculator ─────────────────────────────────

export interface FinanceInput {
  carPrice: number;
  downPayment: number;
  months: number;
  annualRate: number; // e.g. 4.5 for 4.5%
}

export interface FinanceResult {
  loanAmount: number;
  monthlyPayment: number;
  totalCost: number;
  totalInterest: number;
}

/**
 * Calculate monthly payment using standard amortization formula
 */
export function calculateFinance(input: FinanceInput): FinanceResult {
  const loanAmount = input.carPrice - input.downPayment;

  if (loanAmount <= 0) {
    return { loanAmount: 0, monthlyPayment: 0, totalCost: 0, totalInterest: 0 };
  }

  const monthlyRate = input.annualRate / 100 / 12;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / input.months;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -input.months));
  }

  const totalCost = monthlyPayment * input.months;
  const totalInterest = totalCost - loanAmount;

  return {
    loanAmount: Math.round(loanAmount),
    monthlyPayment: Math.round(monthlyPayment),
    totalCost: Math.round(totalCost),
    totalInterest: Math.round(totalInterest),
  };
}

// ─── Insurance Estimate ─────────────────────────────────

export interface InsuranceInput {
  carYear: number;
  carPrice: number;
  driverAge: number;
  youngDriver: boolean;
}

export interface InsuranceResult {
  monthlyEstimate: number;
  annualEstimate: number;
}

/**
 * Rough insurance estimate based on Israeli market ranges.
 * This is an approximation - real quotes come from insurance companies.
 */
export function estimateInsurance(input: InsuranceInput): InsuranceResult {
  const currentYear = new Date().getFullYear();
  const carAge = currentYear - input.carYear;

  // Base rate: ~3-5% of car value per year
  let baseRate = 0.04;

  // Adjust for car age
  if (carAge <= 2) baseRate += 0.005;
  else if (carAge >= 8) baseRate -= 0.01;

  // Adjust for driver age
  if (input.driverAge < 25) baseRate += 0.02;
  else if (input.driverAge < 30) baseRate += 0.01;
  else if (input.driverAge > 50) baseRate -= 0.005;

  // Young driver surcharge
  if (input.youngDriver) baseRate += 0.015;

  // Minimum rate
  baseRate = Math.max(baseRate, 0.02);

  const annualEstimate = Math.round(input.carPrice * baseRate);
  const monthlyEstimate = Math.round(annualEstimate / 12);

  return { monthlyEstimate, annualEstimate };
}

// ─── Fuel Estimate ──────────────────────────────────────

export interface FuelInput {
  monthlyKm?: number;
  fuelConsumptionKmPerLiter: number; // km per liter
  fuelPricePerLiter?: number;
}

export interface FuelResult {
  monthlyLiters: number;
  monthlyCost: number;
}

/**
 * Calculate estimated monthly fuel cost
 */
export function estimateFuelCost(input: FuelInput): FuelResult {
  const monthlyKm = input.monthlyKm ?? DEFAULT_MONTHLY_KM;
  const fuelPrice = input.fuelPricePerLiter ?? DEFAULT_FUEL_PRICE_PER_LITER;

  if (input.fuelConsumptionKmPerLiter <= 0) {
    return { monthlyLiters: 0, monthlyCost: 0 };
  }

  const monthlyLiters = monthlyKm / input.fuelConsumptionKmPerLiter;
  const monthlyCost = monthlyLiters * fuelPrice;

  return {
    monthlyLiters: Math.round(monthlyLiters),
    monthlyCost: Math.round(monthlyCost),
  };
}

// ─── Total Monthly Cost ─────────────────────────────────

export interface TotalMonthlyCostResult {
  finance: number;
  insurance: number;
  fuel: number;
  total: number;
}

export function calculateTotalMonthlyCost(
  finance: FinanceResult,
  insurance: InsuranceResult,
  fuel: FuelResult
): TotalMonthlyCostResult {
  return {
    finance: finance.monthlyPayment,
    insurance: insurance.monthlyEstimate,
    fuel: fuel.monthlyCost,
    total: finance.monthlyPayment + insurance.monthlyEstimate + fuel.monthlyCost,
  };
}
