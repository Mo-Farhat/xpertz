import React, { useState, useCallback } from 'react';
import { ScanLine } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import BarcodeScanner from './BarcodeScanner';
import { useToast } from "../hooks/use-toast";
import { debounce } from 'lodash';

interface BarcodeFormProps {
  onBarcodeDetected: (barcode: string) => void;
}

const BarcodeForm: React.FC<BarcodeFormProps> = ({ onBarcodeDetected }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const { toast } = useToast();

  // Debounce the barcode detection to prevent rapid-fire queries
  const debouncedBarcodeDetection = useCallback(
    debounce((barcode: string) => {
      onBarcodeDetected(barcode);
      toast({
        title: "Searching",
        description: `Looking for barcode: ${barcode}`
      });
    }, 1000),
    [onBarcodeDetected, toast]
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
          <Button type="submit">Search</Button>
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