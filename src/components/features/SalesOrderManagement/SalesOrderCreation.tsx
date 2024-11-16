import React, { useState, useEffect } from 'react';
import { useToast } from "../../hooks/use-toast";
import { salesOrderService } from './SalesOrderCreation/SalesOrderService';
import { SalesOrder, NewSalesOrder } from './SalesOrderCreation/types';
import SalesOrderForm from './SalesOrderCreation/SalesOrderForm';
import SalesOrderHeader from './SalesOrderCreation/SalesOrderHeader';
import OrderList from './SalesOrderCreation/OrderList';
import { fetchSalesMetrics } from '../../services/salesReportingService';
import SalesMetrics from './SalesOrderCreation/SalesMetrics';
import { DateRangePicker } from "../../../components/ui/date-range-picker";
import { DateRange } from "react-day-picker";

const SalesOrderCreation: React.FC = () => {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  });
  const [newOrder, setNewOrder] = useState<NewSalesOrder>({
    customerName: '',
    customerId: '',
    orderDate: new Date(),
    items: [],
    totalAmount: 0,
    status: 'quote',
    orderType: 'retail'
  });
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = salesOrderService.subscribeToOrders(setOrders);
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadMetrics = async () => {
      if (dateRange.from && dateRange.to) {
        try {
          const salesMetrics = await fetchSalesMetrics(dateRange.from, dateRange.to);
          setMetrics(salesMetrics);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load sales metrics",
            variant: "destructive",
          });
        }
      }
    };

    loadMetrics();
  }, [dateRange, toast]);

  const handleAddOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await salesOrderService.createOrder(newOrder);
      setNewOrder({
        customerName: '',
        customerId: '',
        orderDate: new Date(),
        items: [],
        totalAmount: 0,
        status: 'quote',
        orderType: 'retail'
      });
      toast({
        title: "Success",
        description: "Order created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await salesOrderService.deleteOrder(id);
        toast({
          title: "Success",
          description: "Order deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete order",
          variant: "destructive",
        });
      }
    }
  };

  const handleExport = () => {
    const headers = ['Customer Name', 'Order Date', 'Total Amount', 'Status', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...orders.map(order => 
        `${order.customerName},${order.orderDate.toISOString()},${order.totalAmount},${order.status},${order.createdAt.toISOString()}`
      )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sales_orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(dateRange);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SalesOrderHeader onExport={handleExport} />
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
        />
      </div>

      {metrics && <SalesMetrics metrics={metrics} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-4">Create New Order</h4>
          <SalesOrderForm
            order={newOrder}
            onOrderChange={setNewOrder}
            onSubmit={handleAddOrder}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h4 className="text-lg font-semibold mb-4">Recent Orders</h4>
          <OrderList orders={orders} onDelete={handleDeleteOrder} />
        </div>
      </div>
    </div>
  );
};

export default SalesOrderCreation;