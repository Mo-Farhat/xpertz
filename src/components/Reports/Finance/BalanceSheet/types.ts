export interface BalanceSheetData {
    assets: {
      current: {
        cash: number;
        accountsReceivable: number;
        inventory: number;
        otherCurrentAssets: number;
      };
      nonCurrent: {
        propertyAndEquipment: number;
        intangibleAssets: number;
        investments: number;
        otherNonCurrentAssets: number;
      };
    };
    liabilities: {
      current: {
        accountsPayable: number;
        shortTermDebt: number;
        otherCurrentLiabilities: number;
      };
      nonCurrent: {
        longTermDebt: number;
        otherNonCurrentLiabilities: number;
      };
    };
    equity: {
      commonStock: number;
      retainedEarnings: number;
      otherEquity: number;
    };
  }