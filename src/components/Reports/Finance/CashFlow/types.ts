export interface CashFlowData {
    operating: {
      revenue: number;
      expenses: number;
      accountsReceivable: number;
      accountsPayable: number;
      inventory: number;
      otherOperating: number;
    };
    investing: {
      assetPurchases: number;
      assetSales: number;
      investments: number;
      otherInvesting: number;
    };
    financing: {
      debtPayments: number;
      debtProceeds: number;
      equity: number;
      dividends: number;
      otherFinancing: number;
    };
    period: string;
  }