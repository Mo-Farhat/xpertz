import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SalesPerformanceReport from './Sales/SalesPerformanceReport';
import SalesPipelineReport from './Sales/SalesPipelineReport';
import SalesConversionReport from './Sales/SalesConversionReport';
import RevenueByProductReport from './Sales/RevenueByProductReport';
import SalesByRegionReport from './Sales/SalesByRegionReport';
import CustomerPurchaseHistoryReport from './Sales/CustomerPurchaseHistory/CustomerPurchaseHistoryReport';
import SalesForecastReport from './Sales/SalesForecastReport/SalesForecastReport';
import CustomerRetentionReport from './Sales/CustomerRetention/CustomerRetentionReport';
import CustomerSatisfactionReport from './Sales/CustomerSatisfaction/CustomerSatisfactionReport';

const SalesCRMReports: React.FC = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sales & CRM Reports</h2>
      
      <Tabs defaultValue="performance" className="w-full">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="conversion">Conversion</TabsTrigger>
          <TabsTrigger value="revenue">Revenue by Product</TabsTrigger>
          <TabsTrigger value="region">Sales by Region</TabsTrigger>
          <TabsTrigger value="purchase-history">Purchase History</TabsTrigger>
          <TabsTrigger value="forecast">Sales Forecast</TabsTrigger>
          <TabsTrigger value="retention">Customer Retention</TabsTrigger>
          <TabsTrigger value="satisfaction">Customer Satisfaction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <SalesPerformanceReport />
        </TabsContent>
        
        <TabsContent value="pipeline">
          <SalesPipelineReport />
        </TabsContent>

        <TabsContent value="conversion">
          <SalesConversionReport />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueByProductReport />
        </TabsContent>

        <TabsContent value="region">
          <SalesByRegionReport />
        </TabsContent>

        <TabsContent value="purchase-history">
          <CustomerPurchaseHistoryReport />
        </TabsContent>

        <TabsContent value="forecast">
          <SalesForecastReport />
        </TabsContent>

        <TabsContent value="retention">
          <CustomerRetentionReport />
        </TabsContent>

        <TabsContent value="satisfaction">
          <CustomerSatisfactionReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesCRMReports;