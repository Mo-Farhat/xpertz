import React from 'react';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  onClick: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
    >
      <Download size={18} className="mr-2" />
      Export CSV
    </button>
  );
};

export default ExportButton;