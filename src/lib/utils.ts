import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAUD(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Tiered volume discount rules:
 * - 1 qty: 0% off (Regular price)
 * - 2 qty: 5% off
 * - 3 qty: 10% off
 * - 4+ qty: 15% off
 */
export function getQuantityDiscountPercent(qty: number): number {
  if (qty >= 4) return 15;
  if (qty === 3) return 10;
  if (qty === 2) return 5;
  return 0;
}

export function getQuantityDiscountRate(qty: number): number {
  return getQuantityDiscountPercent(qty) / 100;
}

export function getItemEffectiveUnitPrice(basePrice: number, qty: number): number {
  const discountRate = getQuantityDiscountRate(qty);
  return basePrice * (1 - discountRate);
}

export function getItemLineTotal(basePrice: number, qty: number): number {
  return getItemEffectiveUnitPrice(basePrice, qty) * qty;
}

