import React from 'react';
import SearchBar from '../../shared/searchBar';
import BarcodeForm from '../BarcodeForm';

interface InventoryHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onBarcodeDetected: (barcode: string) => void;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onBarcodeDetected
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Inventory</h2>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        placeholder="Search products by name or barcode..."
      />
      <BarcodeForm onBarcodeDetected={onBarcodeDetected} />
    </div>
  );
};

export default InventoryHeader;