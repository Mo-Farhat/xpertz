import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../../components/ui/table";
import { DateRangePicker } from "../../../../../components/ui/date-range-picker";
import { addDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MovementReport = () => {
  const [dateRange, setDateRange] = React.useState({
    from: addDays(new Date(), -30),
    to: new Date()
  });

  // This is a placeholder for actual movement data
  const movementData = [
    { date: '2024-01-01', inflow: 100, outflow: 80 },
    { date: '2024-01-02', inflow: 120, outflow: 90 },
    // ... more data
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <DateRangePicker
          value={dateRange}
          onChange={(range) => {
            if (range.from) {
              setDateRange({
                from: range.from,
                to: range.to || new Date()
              });
            }
          }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Inflow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">+500</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Outflow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-500">-300</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Net Change</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-500">+200</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Movement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="inflow" stroke="#10b981" name="Inflow" />
                <Line type="monotone" dataKey="outflow" stroke="#ef4444" name="Outflow" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movement History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Placeholder for movement history data */}
              <TableRow>
                <TableCell>2024-01-01</TableCell>
                <TableCell>Product A</TableCell>
                <TableCell className="text-green-500">Inflow</TableCell>
                <TableCell className="text-right">+50</TableCell>
                <TableCell>PO-001</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovementReport;