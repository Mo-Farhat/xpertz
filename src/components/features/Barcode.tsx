import React from 'react';
import BarcodeScanner from './BarcodeScanner';
import { useToast } from "../hooks/use-toast";

const Barcode: React.FC = () => {
  const { toast } = useToast();

  const handleBarcodeDetected = (barcode: string) => {
    toast({
      title: "Barcode Detected",
      description: `Scanned barcode: ${barcode}`
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Barcode Scanner</h1>
      <BarcodeScanner onDetected={handleBarcodeDetected} />
    </div>
  );
};

export default Barcode;