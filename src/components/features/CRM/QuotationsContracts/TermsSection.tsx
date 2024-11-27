import React from 'react';
import { Textarea } from "../../../../components/ui/textarea";
import { NewQuotationContract } from './types';

interface TermsSectionProps {
  formData: NewQuotationContract;
  setFormData: React.Dispatch<React.SetStateAction<NewQuotationContract>>;
}

export const TermsSection: React.FC<TermsSectionProps> = ({ formData, setFormData }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Textarea
        placeholder="Document Content"
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="min-h-[100px]"
      />

      <Textarea
        placeholder="Terms & Conditions"
        value={formData.terms}
        onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
      />

      <Textarea
        placeholder="Payment Terms"
        value={formData.paymentTerms}
        onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
      />

      <Textarea
        placeholder="Delivery Terms"
        value={formData.deliveryTerms}
        onChange={(e) => setFormData({ ...formData, deliveryTerms: e.target.value })}
      />

      <Textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />
    </div>
  );
};