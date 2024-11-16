import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Textarea } from "../../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { useToast } from "../../../hooks/use-toast";
import { RFQ, RFQFormProps, RFQItem } from './types';
import RFQItemForm from './RFQItemForm';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';

const RFQForm: React.FC<RFQFormProps> = ({ onSubmit, initialData }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<RFQ, 'id'>>({
    rfqNumber: `RFQ-${Date.now()}`,
    title: '',
    description: '',
    suppliers: [],
    dueDate: new Date(),
    status: 'draft',
    items: [],
    terms: '',
    paymentTerms: '',
    deliveryTerms: '',
    validityPeriod: 30,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user', // Replace with actual user ID
    priority: 'medium',
    category: '',
    notes: ''
  });

  const [currentItem, setCurrentItem] = useState<Omit<RFQItem, 'id'>>({
    productName: '',
    quantity: 0,
    specifications: '',
    estimatedUnitPrice: 0,
    technicalRequirements: '',
    qualityStandards: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one item",
        variant: "destructive"
      });
      return;
    }

    try {
      await addDoc(collection(db, 'rfqs'), {
        ...formData,
        dueDate: formData.dueDate,
        createdAt: formData.createdAt,
        updatedAt: new Date()
      });

      toast({
        title: "Success",
        description: "RFQ created successfully"
      });

      if (onSubmit) {
        onSubmit(formData);
      }

      // Reset form
      setFormData({
        ...formData,
        title: '',
        description: '',
        items: [],
        terms: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating RFQ:', error);
      toast({
        title: "Error",
        description: "Failed to create RFQ",
        variant: "destructive"
      });
    }
  };

  const handleItemChange = (field: keyof Omit<RFQItem, 'id'>, value: any) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddItem = () => {
    if (!currentItem.productName || !currentItem.quantity) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required item fields",
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...currentItem, id: Date.now().toString() }]
    }));

    setCurrentItem({
      productName: '',
      quantity: 0,
      specifications: '',
      estimatedUnitPrice: 0,
      technicalRequirements: '',
      qualityStandards: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Request for Quotation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={formData.rfqNumber}
              placeholder="RFQ Number"
              disabled
            />
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="RFQ Title"
              required
            />
            <Input
              type="date"
              value={formData.dueDate.toISOString().split('T')[0]}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: new Date(e.target.value) }))}
              placeholder="Due Date"
              required
            />
            <Select
              value={formData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description"
          />

          <div className="border p-4 rounded-md">
            <h3 className="font-semibold mb-4">Add Items</h3>
            <RFQItemForm
              item={currentItem}
              onItemChange={handleItemChange}
              onAddItem={handleAddItem}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={formData.paymentTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
              placeholder="Payment Terms"
            />
            <Input
              value={formData.deliveryTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, deliveryTerms: e.target.value }))}
              placeholder="Delivery Terms"
            />
            <Input
              type="number"
              value={formData.validityPeriod}
              onChange={(e) => setFormData(prev => ({ ...prev, validityPeriod: parseInt(e.target.value) }))}
              placeholder="Validity Period (days)"
            />
            <Input
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Category"
            />
          </div>

          <Textarea
            value={formData.terms}
            onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
            placeholder="Terms and Conditions"
          />

          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Additional Notes"
          />

          <Button type="submit">Create RFQ</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RFQForm;