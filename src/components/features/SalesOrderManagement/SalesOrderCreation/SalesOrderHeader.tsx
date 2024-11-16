import React from 'react';
import { Download } from 'lucide-react';
import { Button } from "../../../ui/button";

interface SalesOrderHeaderProps {
  onExport: () => void;
}

const SalesOrderHeader: React.FC<SalesOrderHeaderProps> = ({ onExport }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-2xl font-semibold">Sales Order Creation</h3>
      <Button onClick={onExport} variant="outline">
        <Download className="mr-2 h-4 w-4" /> Export CSV
      </Button>
    </div>
  );
};

export default SalesOrderHeader;