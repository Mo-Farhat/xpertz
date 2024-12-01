import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from "../ui/button";

interface DashboardHeaderProps {
  isCustomizing: boolean;
  onCustomizeClick: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  isCustomizing, 
  onCustomizeClick 
}) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
      <div className="flex items-center gap-4">
        <Button
          onClick={onCustomizeClick}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          {isCustomizing ? 'View Dashboard' : 'Customize Dashboard'}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;