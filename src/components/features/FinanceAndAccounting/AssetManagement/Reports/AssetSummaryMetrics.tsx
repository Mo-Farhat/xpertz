import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card";
import { Asset } from '../types';

interface AssetSummaryMetricsProps {
  assets: Asset[];
}

const AssetSummaryMetrics: React.FC<AssetSummaryMetricsProps> = ({ assets }) => {
  const calculateMetrics = () => {
    const totalAssets = assets.length;
    const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalPurchaseValue = assets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
    const totalDepreciation = totalPurchaseValue - totalValue;
    
    const now = new Date();
    const totalAge = assets.reduce((sum, asset) => {
      const ageInYears = (now.getTime() - asset.purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return sum + ageInYears;
    }, 0);
    const averageAge = totalAge / totalAssets;

    return {
      totalAssets,
      totalValue,
      totalDepreciation,
      averageAge,
    };
  };

  const metrics = calculateMetrics();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{metrics.totalAssets}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Value</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${metrics.totalValue.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Depreciation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">${metrics.totalDepreciation.toFixed(2)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Asset Age</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{metrics.averageAge.toFixed(1)} years</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssetSummaryMetrics;