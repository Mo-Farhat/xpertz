import React, { useState, useRef, useEffect } from 'react';
import { Camera, X } from 'lucide-react';
import Quagga from '@ericblade/quagga2';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "../hooks/use-toast";

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  onClose?: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onDetected, onClose }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const stopScanner = async () => {
    try {
      await Quagga.stop();
      setScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  const startScanner = async () => {
    setIsInitializing(true);
    setError(null);

    try {
      if (!scannerRef.current) {
        throw new Error('Scanner container not found');
      }

      // First, explicitly check and request camera permissions
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(device => device.kind === 'videoinput');
      
      if (cameras.length === 0) {
        throw new Error('No cameras found on this device');
      }

      await Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: scannerRef.current,
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            facingMode: 'environment',
            aspectRatio: { min: 1, max: 2 }
          },
        },
        decoder: {
          readers: [
            'ean_reader',
            'ean_8_reader',
            'code_128_reader',
            'code_39_reader',
            'upc_reader',
            'upc_e_reader'
          ]
        },
        locate: true
      });

      Quagga.start();
      setScanning(true);
      
      Quagga.onDetected((result) => {
        if (result.codeResult.code) {
          navigator?.vibrate?.(200);
          onDetected(result.codeResult.code);
        }
      });

    } catch (err) {
      console.error('Scanner error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to start scanner';
      setError(errorMessage);
      toast({
        title: "Scanner Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <Card className="relative">
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={() => {
            stopScanner();
            onClose();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <div className="p-4">
        <div className="relative">
          <div
            ref={scannerRef}
            className="w-full h-64 bg-black rounded-lg overflow-hidden"
            style={{ minHeight: '300px' }}
          >
            {!scanning && !error && !isInitializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <Camera className="w-8 h-8 mb-2" />
                <p>Click Start Scanner to begin</p>
              </div>
            )}
            {isInitializing && (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center text-red-500 bg-black/50 p-4 text-center">
                <p>{error}</p>
              </div>
            )}
          </div>
          <Button
            onClick={scanning ? stopScanner : startScanner}
            className="w-full mt-4"
            disabled={isInitializing}
          >
            <Camera className="w-4 h-4 mr-2" />
            {scanning ? 'Stop Scanner' : 'Start Scanner'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BarcodeScanner;