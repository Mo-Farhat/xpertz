import React, { useState } from 'react';
import { NewQuotationContract } from './types';
import { FormInputs } from './FormInputs';
import { ProductSection } from './ProductSection';
import { TermsSection } from './TermsSection';

interface QuotationContractFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>, formData: NewQuotationContract) => Promise<void>;
}

const QuotationContractForm: React.FC<QuotationContractFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<NewQuotationContract>({
    type: 'quotation',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    amount: 0,
    status: 'draft',
    validUntil: new Date(),
    content: '',
    terms: '',
    paymentTerms: '',
    deliveryTerms: '',
    notes: '',
    attachments: [],
    assignedTo: '',
    priority: 'medium',
    category: '',
    tags: [],
    revisionNumber: 1,
    items: []
  });

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    onSubmit(e, formData);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <FormInputs formData={formData} setFormData={setFormData} />
      <ProductSection formData={formData} setFormData={setFormData} />
      <TermsSection formData={formData} setFormData={setFormData} />
    </form>
  );
};

export default QuotationContractForm;