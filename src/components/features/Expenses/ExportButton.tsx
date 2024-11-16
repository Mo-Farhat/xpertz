import React from 'react';
import { Button } from "../../../components/ui/button";
import { Download } from "lucide-react";
interface ExportButtonProps {
  onClick: () => void;
}
const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className="mb-4 flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
};
export default ExportButton;