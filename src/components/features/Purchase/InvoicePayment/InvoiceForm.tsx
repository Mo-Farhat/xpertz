import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { Textarea } from "../../../../components/ui/textarea";
import { InvoiceFormProps, InvoiceFormData, LineItemFormData } from './types';
import LineItemForm from './LineItemForm';
import LineItemsTable from './LineItemsTable';

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<InvoiceFormData, 'items' | 'subtotal' | 'totalAmount' | 'paidAmount' | 'balance'>>({
    invoiceNumber: '',
    poNumber: '',
    supplierId: '',
    dueDate: '',
    paymentTerms: '30',
    taxRate: 0,
    discount: 0,
    notes: '',
    currency: 'USD',
    status: 'pending'
  });

  const [items, setItems] = useState<InvoiceFormData['items']>([]);
  const [currentItem, setCurrentItem] = useState<LineItemFormData>({
    description: '',
    quantity: 0,
    unitPrice: 0,
    total: 0
  });

  const handleItemChange = (field: keyof LineItemFormData, value: any) => {
    setCurrentItem(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.unitPrice) {
      toast({
        title: "Validation Error",
        description: "Please fill in all item fields",
        variant: "destructive",
      });
      return;
    }

    const totalPrice = currentItem.quantity * currentItem.unitPrice;
    setItems([...items, { 
      ...currentItem, 
      totalPrice, 
      id: Date.now().toString() 
    }]);
    
    setCurrentItem({
      description: '',
      quantity: 0,
      unitPrice: 0,
      total: 0
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = subtotal * (formData.taxRate / 100);
    const discountAmount = subtotal * (formData.discount / 100);
    return {
      subtotal,
      taxAmount,
      discountAmount,
      total: subtotal + taxAmount - discountAmount
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one item",
        variant: "destructive",
      });
      return;
    }

    const totals = calculateTotals();
    const invoiceData: InvoiceFormData = {
      ...formData,
      items,
      subtotal: totals.subtotal,
      totalAmount: totals.total,
      paidAmount: 0,
      balance: totals.total
    };

    try {
      await onSubmit(invoiceData);
      toast({
        title: "Success",
        description: "Invoice created successfully"
      });
      // Reset form
      setFormData({
        invoiceNumber: '',
        poNumber: '',
        supplierId: '',
        dueDate: '',
        paymentTerms: '30',
        taxRate: 0,
        discount: 0,
        notes: '',
        currency: 'USD',
        status: 'pending'
      });
      setItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Invoice Number"
          value={formData.invoiceNumber}
          onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
          required
        />
        <Input
          placeholder="PO Number"
          value={formData.poNumber}
          onChange={(e) => setFormData({ ...formData, poNumber: e.target.value })}
          required
        />
        <Input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
        <Select
          value={formData.paymentTerms}
          onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Payment Terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="immediate">Immediate</SelectItem>
            <SelectItem value="15">Net 15</SelectItem>
            <SelectItem value="30">Net 30</SelectItem>
            <SelectItem value="60">Net 60</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border p-4 rounded-md space-y-4">
        <h3 className="font-semibold">Line Items</h3>
        <LineItemForm
          currentItem={currentItem}
          onItemChange={handleItemChange}
          onAddItem={handleAddItem}
        />
        <LineItemsTable items={items} onRemoveItem={handleRemoveItem} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          placeholder="Tax Rate (%)"
          value={formData.taxRate || ''}
          onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
        />
        <Input
          type="number"
          placeholder="Discount (%)"
          value={formData.discount || ''}
          onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
        />
      </div>

      <Textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />

      <div className="flex justify-end">
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
};

export default InvoiceForm;