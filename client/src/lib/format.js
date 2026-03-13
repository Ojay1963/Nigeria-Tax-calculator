export function formatCurrency(value) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}
