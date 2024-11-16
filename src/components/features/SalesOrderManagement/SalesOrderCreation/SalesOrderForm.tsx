import React, { useState, useEffect } from 'react';
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { salesOrderService } from './SalesOrderService';
import { SalesOrderFormProps } from './types';
import { Customer } from './types';
import { Product } from './types';

const SalesOrderForm: React.FC<SalesOrderFormProps> = ({ order, onOrderChange, onSubmit }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventoryItems, setInventoryItems] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const loadData = async () => {
      const [fetchedCustomers, fetchedItems] = await Promise.all([
        salesOrderService.fetchCustomers(),
        salesOrderService.fetchInventoryItems()
      ]);
      setCustomers(fetchedCustomers);
      setInventoryItems(fetchedItems);
    };
    loadData();
  }, []);

  const handleAddItem = () => {
    const product = inventoryItems.find(item => item.id === selectedProduct);
    if (product) {
      const newItem = {
        id: product.id,
        name: product.name,
        quantity,
        price: product.price,
        subtotal: quantity * product.price
      };
      onOrderChange({
        ...order,
        items: [...order.items, newItem]
      });
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Select
        value={order.customerId}
        onValueChange={(value) => {
          const customer = customers.find(c => c.id === value);
          onOrderChange({
            ...order,
            customerId: value,
            customerName: customer?.name || ''
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map((customer) => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={order.orderType}
        onValueChange={(value: 'retail' | 'wholesale' | 'online') => {
          onOrderChange({
            ...order,
            orderType: value
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Order Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="retail">Retail</SelectItem>
          <SelectItem value="wholesale">Wholesale</SelectItem>
          <SelectItem value="online">Online</SelectItem>
        </SelectContent>
      </Select>

      <div className="space-y-4">
        <div className="flex gap-4">
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger>
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent>
              {inventoryItems.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name} - ${item.price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Quantity"
            className="w-32"
          />

          <Button type="button" onClick={handleAddItem}>
            Add Item
          </Button>
        </div>

        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center p-2 border rounded">
              <span>{item.name}</span>
              <span>{item.quantity} x ${item.price} = ${item.subtotal}</span>
              <Button
                type="button"
                variant="destructive"
                onClick={() => onOrderChange({
                  ...order,
                  items: order.items.filter((_, i) => i !== index)
                })}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Order
      </Button>
    </form>
  );
};

export default SalesOrderForm;