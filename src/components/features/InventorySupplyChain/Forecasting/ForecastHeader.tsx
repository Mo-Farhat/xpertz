import React from 'react';
import { Button } from "../../../../components/ui/button";
import { CardTitle } from "../../../../components/ui/card";
import { Download, TrendingUp } from 'lucide-react';

interface ForecastHeaderProps {
  onAutoGenerate: () => void;
  onExport: () => void;
}

const ForecastHeader: React.FC<ForecastHeaderProps> = ({
  onAutoGenerate,
  onExport
}) => {
  return (
    <div className="flex justify-between items-center">
      <CardTitle>Demand Forecasting</CardTitle>
      <div className="flex gap-2">
        <Button 
          onClick={onAutoGenerate}
          className="flex items-center gap-2"
          variant="outline"
        >
          <TrendingUp className="h-4 w-4" />
          Auto-Generate
        </Button>
        <Button 
          onClick={onExport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
};

export default ForecastHeader;