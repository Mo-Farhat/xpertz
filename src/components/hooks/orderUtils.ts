export const generateOrderId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  };
  
  export const generatePaymentSchedule = (
    amount: number,
    months: number,
    startDate: Date
  ): { id: string; amount: number; dueDate: Date; status: 'pending' }[] => {
    const payments = [];
    const monthlyPayment = amount / months;
    
    for (let i = 0; i < months; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      
      payments.push({
        id: `payment-${i + 1}`,
        amount: monthlyPayment,
        dueDate,
        status: 'pending'
      });
    }
    
    return payments;
  };