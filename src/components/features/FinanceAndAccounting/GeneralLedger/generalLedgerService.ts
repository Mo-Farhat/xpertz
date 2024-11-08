import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { LedgerEntry, DateRange } from './types';

export const fetchLedgerEntries = async (tenantId: string, dateRange: DateRange): Promise<LedgerEntry[]> => {
  const entries: LedgerEntry[] = [];
  
  // Fetch AP entries
  const apQuery = query(
    collection(db, `tenants/${tenantId}/payables`),
    where('date', '>=', Timestamp.fromDate(dateRange.from)),
    where('date', '<=', Timestamp.fromDate(dateRange.to)),
    orderBy('date', 'asc')
  );
  
  const apSnapshot = await getDocs(apQuery);
  apSnapshot.docs.forEach(doc => {
    const data = doc.data();
    entries.push({
      id: doc.id,
      date: data.date.toDate(),
      description: `AP Invoice: ${data.invoiceNumber} - ${data.vendorName}`,
      accountNumber: '2000',
      accountName: 'Accounts Payable',
      category: 'AP',
      debit: data.amount,
      credit: 0,
      reference: data.invoiceNumber,
      status: data.status === 'paid' ? 'completed' : 'pending',
      module: { type: 'AP', id: doc.id }
    });
  });

  // Fetch AR entries
  const arQuery = query(
    collection(db, `tenants/${tenantId}/receivables`),
    where('date', '>=', Timestamp.fromDate(dateRange.from)),
    where('date', '<=', Timestamp.fromDate(dateRange.to)),
    orderBy('date', 'asc')
  );
  
  const arSnapshot = await getDocs(arQuery);
  arSnapshot.docs.forEach(doc => {
    const data = doc.data();
    entries.push({
      id: doc.id,
      date: data.date.toDate(),
      description: `AR Invoice: ${data.invoiceNumber} - ${data.customerName}`,
      accountNumber: '1200',
      accountName: 'Accounts Receivable',
      category: 'AR',
      debit: 0,
      credit: data.amount,
      reference: data.invoiceNumber,
      status: data.status === 'paid' ? 'completed' : 'pending',
      module: { type: 'AR', id: doc.id }
    });
  });

  // Fetch Payroll entries
  const payrollQuery = query(
    collection(db, `tenants/${tenantId}/payroll`),
    where('date', '>=', Timestamp.fromDate(dateRange.from)),
    where('date', '<=', Timestamp.fromDate(dateRange.to)),
    orderBy('date', 'asc')
  );
  
  const payrollSnapshot = await getDocs(payrollQuery);
  payrollSnapshot.docs.forEach(doc => {
    const data = doc.data();
    entries.push({
      id: doc.id,
      date: data.date.toDate(),
      description: `Payroll: ${data.period}`,
      accountNumber: '5000',
      accountName: 'Payroll Expense',
      category: 'Payroll',
      debit: data.totalAmount,
      credit: 0,
      reference: data.reference,
      status: 'completed',
      module: { type: 'Payroll', id: doc.id }
    });
  });

  // Fetch Inventory entries
  const inventoryQuery = query(
    collection(db, `tenants/${tenantId}/inventory`),
    where('date', '>=', Timestamp.fromDate(dateRange.from)),
    where('date', '<=', Timestamp.fromDate(dateRange.to)),
    orderBy('date', 'asc')
  );
  
  const inventorySnapshot = await getDocs(inventoryQuery);
  inventorySnapshot.docs.forEach(doc => {
    const data = doc.data();
    entries.push({
      id: doc.id,
      date: data.date.toDate(),
      description: `Inventory: ${data.type} - ${data.productName}`,
      accountNumber: '1300',
      accountName: 'Inventory',
      category: 'Inventory',
      debit: data.type === 'purchase' ? data.amount : 0,
      credit: data.type === 'sale' ? data.amount : 0,
      reference: data.reference,
      status: 'completed',
      module: { type: 'Inventory', id: doc.id }
    });
  });

  return entries.sort((a, b) => a.date.getTime() - b.date.getTime());
};