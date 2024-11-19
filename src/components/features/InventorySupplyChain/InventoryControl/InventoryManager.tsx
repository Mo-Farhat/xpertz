import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { Plus, Download, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useInventory } from './useInventory';
import { useToast } from "../../../hooks/use-toast";
import { Product } from './pTypes';
    
interface InventoryManagerProps {
    loading: boolean;
    products: Product[];
    onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    onUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>;
    onDeleteProduct: (id: string) => Promise<void>;
  }
  
  const InventoryManager: React.FC<InventoryManagerProps> = ({
    loading,
    products,
    onAddProduct,
    onUpdateProduct,
    onDeleteProduct
  }) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState('all');
    const { toast } = useToast();
  
    const handleExport = () => {
      const csvContent = products.map(item => 
        `${item.name},${item.quantity},${item.price},${item.minSellingPrice},${item.lowStockThreshold}`
      ).join('\n');
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'inventory.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    const filteredProducts = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventory Management</CardTitle>
            <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="raw-materials">Raw Materials</SelectItem>
                <SelectItem value="finished-goods">Finished Goods</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
              </SelectContent>
            </Select>
          </div>
  
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Min. Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => {
                  const status = product.quantity === 0 
                    ? 'Out of Stock' 
                    : product.quantity <= product.lowStockThreshold 
                    ? 'Low Stock' 
                    : 'In Stock';
                  const statusColor = {
                    'Out of Stock': 'text-red-500',
                    'Low Stock': 'text-yellow-500',
                    'In Stock': 'text-green-500'
                  }[status];
  
                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                        {status !== 'In Stock' && (
                          <AlertTriangle className="h-4 w-4 inline ml-2 text-yellow-500" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${product.minSellingPrice.toFixed(2)}</TableCell>
                      <TableCell className={statusColor}>{status}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onUpdateProduct(product.id, {})}
                          className="mr-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            onDeleteProduct(product.id);
                            toast({
                              title: "Product deleted",
                              description: "The product has been removed from inventory",
                            });
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default InventoryManager;