import React from 'react';
import { Download } from 'lucide-react';
import { Button } from "../../../../components/ui/button";
import { TaxRecord } from './types';

interface ExportButtonProps {
  taxRecords: TaxRecord[];
}

const ExportButton: React.FC<ExportButtonProps> = ({ taxRecords }) => {
  const handleExport = () => {
    const csvContent = taxRecords.map(record => 
      `${record.taxYear},${record.taxType},${record.amount},${record.dueDate.toISOString()},${record.status},${record.region}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tax_records.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="mb-4 bg-green-500 hover:bg-green-600 flex items-center"
    >
      <Download size={18} className="mr-2" />
      Export CSV
    </Button>
  );
};

export default ExportButton;