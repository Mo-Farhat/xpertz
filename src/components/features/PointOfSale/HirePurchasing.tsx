import React, { useState, useEffect } from 'react';
import { useSalesContext } from './SalesContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../../hooks/use-toast";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Customer, HirePurchaseAgreement } from './types';
import HirePurchaseForm from './HirePurchaseForm';
import HirePurchaseSummary from './HirePurchaseSummary';

const HirePurchasing: React.FC = () => {
  const { hirePurchaseItems, createHirePurchaseAgreement } = useSalesContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      const customersCollection = collection(db, 'customers');
      const customersSnapshot = await getDocs(customersCollection);
      const customersList = customersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Customer));
      setCustomers(customersList);
    };

    fetchCustomers();
  }, []);

  const handleConfirm = async (formData: HirePurchaseAgreement) => {
    try {
      const agreementId = await createHirePurchaseAgreement(formData);

      toast({
        title: "Hire Purchase Confirmed",
        description: `Agreement ${agreementId} created for ${formData.selectedCustomer.name}. Monthly payment of $${formData.monthlyPayment.toFixed(2)} for ${formData.months} months.`,
      });
      navigate('/point-of-sale');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create hire purchase agreement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    navigate('/point-of-sale');
  };

  if (hirePurchaseItems.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">No items for hire purchase</h2>
        <button onClick={handleBack} className="bg-blue-500 text-white px-4 py-2 rounded">
          Back to Point of Sale
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <HirePurchaseForm
        customers={customers}
        hirePurchaseItems={hirePurchaseItems}
        onConfirm={handleConfirm}
        onBack={handleBack}
      />
      <HirePurchaseSummary hirePurchaseItems={hirePurchaseItems} />
    </div>
  );
};

export default HirePurchasing;