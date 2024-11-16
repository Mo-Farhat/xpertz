import React, { useState } from 'react';
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { useToast } from "../../../hooks/use-toast";
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../../../firebase';
import PurchaseOrderItemForm from './components/PurchaseOrderItemForm';
import PurchaseOrderItemsTable from './components/PurchaseOrderItemsTable';
import { PurchaseOrderFormProps, PurchaseOrder, PaymentMethod } from './types/purchaseOrderTypes';
import { usePurchaseOrderForm } from '../../../hooks/usePurchaseOrderForm';
import { useEvents } from '../../Calendar/EventContext';
import { addDays } from 'date-fns';

const PurchaseOrderForm: React.FC<PurchaseOrderFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const { addEvent } = useEvents();
  const {
    suppliers,
    products,
    items,
    setItems,
    selectedSupplier,
    setSelectedSupplier,
    terms,
    setTerms,
    notes,
    setNotes
  } = usePurchaseOrderForm();

  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('cash');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const createChequeReminder = async (poNumber: string, supplier: string, amount: number, dueDate: Date) => {
    await addEvent({
      title: `Cheque Payment Due - PO: ${poNumber}`,
      description: `Payment due for ${supplier} - Amount: $${amount.toFixed(2)}`,
      start: dueDate,
      end: dueDate,
      type: 'payment',
      priority: 'high'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSupplier) {
      toast({
        title: "Validation Error",
        description: "Please select a supplier",
        variant: "destructive",
      });
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    try {
      const poNumber = `PO-${Date.now()}`;
      const purchaseOrder: Omit<PurchaseOrder, 'id'> = {
        poNumber,
        supplierId: selectedSupplier,
        orderDate: new Date(),
        expectedDeliveryDate: new Date(expectedDeliveryDate),
        status: 'draft',
        items,
        totalAmount,
        terms: terms || '',
        notes: notes || '',
        paymentMethod,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'purchaseOrders'), purchaseOrder);

      // Update inventory onOrder quantities
      for (const item of items) {
        const productRef = doc(db, 'inventory', item.productId);
        await updateDoc(productRef, {
          onOrder: increment(item.quantity)
        });
      }

      // Create calendar reminder if payment method is cheque
      if (paymentMethod === 'cheque') {
        const supplier = suppliers.find(s => s.id === selectedSupplier)?.name || 'Unknown Supplier';
        const reminderDate = addDays(new Date(expectedDeliveryDate), 1); // Set reminder for day after delivery
        await createChequeReminder(poNumber, supplier, totalAmount, reminderDate);
        
        toast({
          title: "Reminder Set",
          description: "A calendar reminder has been created for the cheque payment",
        });
      }
      
      toast({
        title: "Success",
        description: "Purchase order created successfully",
      });

      if (onSubmit) {
        onSubmit({ ...purchaseOrder, id: docRef.id });
      }

      // Reset form
      setItems([]);
      setSelectedSupplier('');
      setTerms('');
      setNotes('');
      setPaymentMethod('cash');
      setExpectedDeliveryDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error creating purchase order:', error);
      toast({
        title: "Error",
        description: "Failed to create purchase order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Purchase Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Select 
            value={selectedSupplier}
            onValueChange={setSelectedSupplier}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers?.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Select
              value={paymentMethod}
              onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              placeholder="Expected Delivery Date"
            />
          </div>

          <div className="border p-4 rounded-md space-y-4">
            <h3 className="font-semibold">Add Items</h3>
            <PurchaseOrderItemForm
              products={products}
              onAddItem={(item) => setItems([...items, item])}
            />
            <PurchaseOrderItemsTable items={items} />
          </div>

          <div className="space-y-4">
            <Input
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="Terms and Conditions"
            />
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional Notes"
            />
          </div>

          <Button type="submit">Create Purchase Order</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PurchaseOrderForm;