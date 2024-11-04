import React, { useState } from 'react';
import { Scan } from 'lucide-react';
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import BarcodeScanner from '../BarcodeScanner';
import { useSalesContext } from './SalesContext';
import { useToast } from "../../hooks/use-toast";

const BarcodeSearch = () => {
  const [showScanner, setShowScanner] = useState(false);
  const { products, addToCart, setError } = useSalesContext();
  const { toast } = useToast();

  const handleBarcodeDetected = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    
    if (product) {
      addToCart(product);
      toast({
        title: "Product Found",
        description: `Added ${product.name} to cart`,
      });
      setShowScanner(false);
    } else {
      toast({
        title: "Product Not Found",
        description: `No product found with barcode: ${barcode}`,
        variant: "destructive"
      });
      setError(`No product found with barcode: ${barcode}`);
    }
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col gap-4">
        <Button 
          onClick={() => setShowScanner(!showScanner)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Scan className="w-4 h-4" />
          {showScanner ? 'Close Scanner' : 'Scan Barcode'}
        </Button>

        {showScanner && (
          <div className="mt-2">
            <BarcodeScanner 
              onDetected={handleBarcodeDetected}
              onClose={() => setShowScanner(false)}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default BarcodeSearch;