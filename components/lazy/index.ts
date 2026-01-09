import { lazy } from "react";

// Lazy load de componentes pesados
export const FinancialChartLazy = lazy(() =>
  import("../dashboard/FinancialChart").then((module) => ({
    default: module.FinancialChart,
  }))
);

export const TransactionsListLazy = lazy(() =>
  import("../dashboard/TransactionsList").then((module) => ({
    default: module.TransactionsList,
  }))
);
