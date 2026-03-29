export const EXPENSE_TRACKER_STORAGE_KEY = "naija-tax-calculator-expense-tracker";

export function getDefaultEntryDate() {
  return new Date().toISOString().slice(0, 10);
}

export function buildEntry({ type, amount, description = "", date = "" }) {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    amount: Number(amount),
    description: description.trim(),
    date,
    createdAt: new Date().toISOString()
  };
}

export function normalizeEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .map(entry => ({
      id: entry?.id || `entry-${Math.random().toString(36).slice(2, 8)}`,
      type: entry?.type === "expense" ? "expense" : "income",
      amount: Number(entry?.amount || 0),
      description: typeof entry?.description === "string" ? entry.description : "",
      date: typeof entry?.date === "string" ? entry.date : "",
      createdAt: typeof entry?.createdAt === "string" ? entry.createdAt : new Date().toISOString()
    }))
    .filter(entry => Number.isFinite(entry.amount) && entry.amount >= 0);
}

export function calculateTrackerSummary(entries) {
  const normalizedEntries = normalizeEntries(entries);
  const totalIncome = normalizedEntries
    .filter(entry => entry.type === "income")
    .reduce((sum, entry) => sum + entry.amount, 0);
  const totalExpenses = normalizedEntries
    .filter(entry => entry.type === "expense")
    .reduce((sum, entry) => sum + entry.amount, 0);

  return {
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses
  };
}

export function getMonthlySummary(entries) {
  const monthlyMap = new Map();

  normalizeEntries(entries).forEach(entry => {
    if (!entry.date) {
      return;
    }

    const monthKey = entry.date.slice(0, 7);
    const monthData = monthlyMap.get(monthKey) || {
      monthKey,
      income: 0,
      expenses: 0
    };

    if (entry.type === "income") {
      monthData.income += entry.amount;
    } else {
      monthData.expenses += entry.amount;
    }

    monthlyMap.set(monthKey, monthData);
  });

  return Array.from(monthlyMap.values())
    .map(item => ({
      ...item,
      netProfit: item.income - item.expenses
    }))
    .sort((left, right) => right.monthKey.localeCompare(left.monthKey));
}

export function createExpenseTrackerCsv(entries) {
  const rows = [
    ["Type", "Amount", "Description", "Date"],
    ...normalizeEntries(entries).map(entry => [
      entry.type === "income" ? "Income" : "Expense",
      entry.amount.toFixed(2),
      entry.description || "",
      entry.date || ""
    ])
  ];

  return rows
    .map(row =>
      row
        .map(value => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    )
    .join("\n");
}
