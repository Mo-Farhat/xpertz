import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import AssetSummaryMetrics from './Reports/AssetSummaryMetrics';
import AssetDepreciationChart from './Reports/AssetDepreciationChart';
import AssetCategoryDistribution from './Reports/AssetCategoryDistribution';
import { Asset } from './types';

interface AssetReportsProps {
  assets: Asset[];
}

const AssetReports: React.FC<AssetReportsProps> = ({ assets }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Asset Reports & Analysis</h2>
      
      <AssetSummaryMetrics assets={assets} />
      
      <Tabs defaultValue="depreciation" className="w-full">
        <TabsList>
          <TabsTrigger value="depreciation">Depreciation Analysis</TabsTrigger>
          <TabsTrigger value="distribution">Category Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="depreciation">
          <AssetDepreciationChart assets={assets} />
        </TabsContent>
        
        <TabsContent value="distribution">
          <AssetCategoryDistribution assets={assets} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetReports;