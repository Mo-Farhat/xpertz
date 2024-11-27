import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useSalesContext } from './SalesContext';
import ProductGridView from './ProductGridView';
import Cart from './Cart';
import { Input } from "../../ui/input";
import PaymentValidation from './PaymentValidation';
import HirePurchasePaymentValidation from './HirePurchasePaymentValidation';
import ReturnForm from './ReturnForm';
import Numpad from './Numpad';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Card, CardContent } from "../../ui/card";

const SalesTransactionManagement: React.FC = () => {
  const { searchTerm, setSearchTerm, error, addToCart, products, setTotalDiscount, applyProductDiscount, calculateTotal, calculateSubtotal } = useSalesContext();
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [numpadValue, setNumpadValue] = useState('');
  const [activeTab, setActiveTab] = useState('regular');
  const [showPayment, setShowPayment] = useState(false);

  const handleNumpadClick = (value: string) => {
    if (activeInput === 'search') {
      setSearchTerm(prev => prev + value);
    } else if (activeInput?.startsWith('product-') || activeInput === 'totalDiscount') {
      setNumpadValue(prev => prev + value);
    }
  };

  const handleDiscountClick = () => {
    if (!activeInput?.startsWith('product-') && activeInput !== 'totalDiscount') {
      setActiveInput('totalDiscount');
      setNumpadValue('');
    }
  };

  const handleBackspaceClick = () => {
    if (activeInput === 'search') {
      setSearchTerm(prev => prev.slice(0, -1));
    } else if (activeInput?.startsWith('product-') || activeInput === 'totalDiscount') {
      setNumpadValue(prev => prev.slice(0, -1));
    }
  };

  const handleEnterClick = () => {
    if (activeInput?.startsWith('product-')) {
      const productId = activeInput.split('-')[1];
      applyProductDiscount(productId, parseFloat(numpadValue));
    } else if (activeInput === 'totalDiscount') {
      setTotalDiscount(parseFloat(numpadValue));
    }
    setNumpadValue('');
    setActiveInput(null);
  };

  if (showPayment) {
    return activeTab === 'hirePurchase' 
      ? <HirePurchasePaymentValidation onBack={() => setShowPayment(false)} />
      : <PaymentValidation onBack={() => setShowPayment(false)} />;
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal();
  const totalDiscount = subtotal - total;
  const discountPercentage = ((totalDiscount / subtotal) * 100) || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4 h-[calc(100vh-6rem)] max-h-screen overflow-hidden">
      <Card className="flex flex-col overflow-hidden">
        <CardContent className="p-4 h-full flex flex-col">
          <div className="relative mb-4 flex-shrink-0">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setActiveInput('search')}
              className="pl-10 h-12 text-lg"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
          </div>
          <div className="flex-1 overflow-auto min-h-0">
            <ProductGridView
              products={products}
              onAddToCart={addToCart}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="flex flex-col h-full">
        <CardContent className="p-4 flex flex-col h-full">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="regular">Regular</TabsTrigger>
              <TabsTrigger value="hirePurchase">Hire Purchase</TabsTrigger>
              <TabsTrigger value="returns">Returns</TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-auto">
                <TabsContent value="regular" className="m-0 h-full">
                  <Cart
                    onSetActiveInput={setActiveInput}
                    activeInput={activeInput}
                    numpadValue={numpadValue}
                    onApplyDiscount={(productId, discount) => applyProductDiscount(productId, discount)}
                    isHirePurchase={false}
                  />
                </TabsContent>
                <TabsContent value="hirePurchase" className="m-0 h-full">
                  <Cart
                    onSetActiveInput={setActiveInput}
                    activeInput={activeInput}
                    numpadValue={numpadValue}
                    onApplyDiscount={(productId, discount) => applyProductDiscount(productId, discount)}
                    isHirePurchase={true}
                  />
                </TabsContent>
                <TabsContent value="returns" className="m-0 h-full">
                  <ReturnForm onComplete={() => setActiveTab('regular')} />
                </TabsContent>
              </div>

              {activeTab !== 'returns' && (
                <div className="mt-4 space-y-4 flex-shrink-0">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Discount:</span>
                      <span>-${totalDiscount.toFixed(2)} ({discountPercentage.toFixed(1)}%)</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <Numpad
                      onNumberClick={handleNumpadClick}
                      onDiscountClick={handleDiscountClick}
                      onBackspaceClick={handleBackspaceClick}
                      onEnterClick={handleEnterClick}
                    />
                  </div>
                  
                  <button 
                    className="w-full h-14 text-lg font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors duration-200 rounded-lg"
                    onClick={() => setShowPayment(true)}
                  >
                    Proceed to Payment
                  </button>
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default SalesTransactionManagement;