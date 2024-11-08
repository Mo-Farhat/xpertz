import React from 'react';
import ARMetrics from './ARMetrics';
import ARAgingAnalysis from './ARAgingAnalysis';
import ARCustomerChart from './ARCustomerChart';
import { ARInvoice } from './types';

interface ARReportProps {
  invoices: ARInvoice[];
}

const ARReport: React.FC<ARReportProps> = ({ invoices }) => {
  return (
    <div className="space-y-6">
      <ARMetrics invoices={invoices} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ARAgingAnalysis invoices={invoices} />
        <ARCustomerChart invoices={invoices} />
      </div>
    </div>
  );
};

export default ARReport;