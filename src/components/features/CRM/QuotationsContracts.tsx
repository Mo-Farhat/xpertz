import React, { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import { Button } from "../../../components/ui/button";
import { QuotationContract, NewQuotationContract } from './QuotationsContracts/types';
import QuotationContractForm from './QuotationsContracts/QuotationContractForm';
import QuotationContractTable from './QuotationsContracts/QuotationContractTable';
import QuotationPrintView from './QuotationsContracts/QuotationPrintView';
import { useQuotationDocuments } from './QuotationsContracts/useQuotationDocument';
import { useQuotationOperations } from './QuotationsContracts/useQuotationOperation';
import { useToast } from "../../hooks/use-toast";

const QuotationsContracts: React.FC = () => {
  const documents = useQuotationDocuments();
  const { handleAddDocument, handleUpdateDocument, handleDeleteDocument } = useQuotationOperations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<QuotationContract | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, formData: NewQuotationContract) => {
    e.preventDefault();
    console.log('Form submission initiated with data:', formData);
    
    try {
      await handleAddDocument(formData);
      toast({
        title: "Success",
        description: "Document created successfully"
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "Failed to create document",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    const headers = [
      'Type', 'Customer Name', 'Email', 'Phone', 'Amount', 'Status',
      'Valid Until', 'Priority', 'Category', 'Assigned To', 'Created At'
    ].join(',');

    const csvContent = [
      headers,
      ...documents.map(doc => [
        doc.type,
        doc.customerName,
        doc.customerEmail,
        doc.customerPhone,
        doc.amount,
        doc.status,
        doc.validUntil.toISOString(),
        doc.priority,
        doc.category,
        doc.assignedTo,
        doc.createdAt.toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'quotations_contracts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = (document: QuotationContract) => {
    console.log('Print initiated for document:', document.id);
    setSelectedDocument(document);
    
    setTimeout(() => {
      if (printRef.current) {
        console.log('Print ref found, preparing print window');
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Print Quotation</title>');
          printWindow.document.write('<style>');
          printWindow.document.write(`
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border-bottom: 1px solid #ddd; }
            th { text-align: left; }
            .text-right { text-align: right; }
          `);
          printWindow.document.write('</style></head><body>');
          printWindow.document.write(printRef.current.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.focus();
          
          setTimeout(() => {
            console.log('Initiating print operation');
            printWindow.print();
            printWindow.close();
          }, 250);
        } else {
          console.error('Failed to open print window');
          toast({
            title: "Error",
            description: "Failed to open print window",
            variant: "destructive",
          });
        }
        
        toast({
          title: "Success",
          description: "Document sent to printer",
        });
      } else {
        console.error('Print ref not found');
        toast({
          title: "Error",
          description: "Failed to prepare document for printing",
          variant: "destructive",
        });
      }
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quotations & Contracts</h2>
        <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <QuotationContractForm onSubmit={handleSubmit} />

      <QuotationContractTable
        documents={documents}
        onEdit={setEditingId}
        onDelete={handleDeleteDocument}
        onPrint={handlePrint}
      />

      <div className="hidden">
        {selectedDocument && (
          <QuotationPrintView ref={printRef} document={selectedDocument} />
        )}
      </div>
    </div>
  );
};

export default QuotationsContracts;