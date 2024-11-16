import React, { useState, useCallback } from 'react';
import { ScanLine } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import BarcodeScanner from './BarcodeScanner';
import { useToast } from "../hooks/use-toast";
import { debounce } from 'lodash';
import { findProductByBarcode } from '../services/barcodeService';

interface BarcodeFormProps {
  onBarcodeDetected: (barcode: string) => void;
  onProductFound?: (product: any) => void;
}

const BarcodeForm: React.FC<BarcodeFormProps> = ({ onBarcodeDetected, onProductFound }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleProductLookup = async (barcode: string) => {
    setIsSearching(true);
    try {
      const product = await findProductByBarcode(barcode);
      if (product) {
        toast({
          title: "Product Found",
          description: `Found: ${product.name}`,
        });
        if (onProductFound) {
          onProductFound(product);
        }
      } else {
        toast({
          title: "Product Not Found",
          description: `No product found with barcode: ${barcode}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to look up product",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce the barcode detection to prevent rapid-fire queries
  const debouncedBarcodeDetection = useCallback(
    debounce((barcode: string) => {
      onBarcodeDetected(barcode);
      handleProductLookup(barcode);
    }, 1000),
    [onBarcodeDetected]
  );

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      debouncedBarcodeDetection(manualBarcode.trim());
      setManualBarcode('');
    } else {
      toast({
        title: "Error",
        description: "Please enter a barcode",
        variant: "destructive"
      });
    }
  };

  const handleBarcodeScanned = (barcode: string) => {
    setIsScanning(false);
    debouncedBarcodeDetection(barcode);
  };

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter barcode manually"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </form>

        <div className="flex items-center justify-between">
          <Button
            onClick={() => setIsScanning(!isScanning)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ScanLine className="w-4 h-4" />
            {isScanning ? 'Stop Scanning' : 'Start Scanner'}
          </Button>
        </div>

        {isScanning && (
          <div className="mt-4">
            <BarcodeScanner onDetected={handleBarcodeScanned} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default BarcodeForm;