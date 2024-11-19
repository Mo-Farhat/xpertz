export const printReceipt = (receiptElement: HTMLElement | null) => {
    if (!receiptElement) return;
  
    const printWindow = window.open('', '', 'width=600,height=600');
    if (!printWindow) return;
  
    printWindow.document.write('<html><head><title>Print Receipt</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
      #receipt { max-width: 300px; margin: 0 auto; }
      .text-sm { font-size: 0.875rem; }
      .text-gray-600 { color: #4B5563; }
      .font-bold { font-weight: bold; }
      .space-y-1 > * + * { margin-top: 0.25rem; }
      .border-t { border-top: 1px solid #E5E7EB; }
      .border-b { border-bottom: 1px solid #E5E7EB; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mt-4 { margin-top: 1rem; }
      .text-center { text-align: center; }
      .text-xl { font-size: 1.25rem; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(receiptElement.outerHTML);
    printWindow.document.write('</body></html>');
  
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };