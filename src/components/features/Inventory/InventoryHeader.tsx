import React from 'react';
import SearchBar from '../../shared/searchBar';

interface InventoryHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Inventory</h2>
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        placeholder="Search products by name or barcode..."
      />
    </div>
  );
};

export default InventoryHeader;