import React from 'react';

interface RegionPerformanceTableProps {
  data: Array<{
    region: string;
    totalSales: number;
    orderCount: number;
    averageOrderValue: number;
    topProducts: Array<{
      name: string;
      quantity: number;
      revenue: number;
    }>;
  }>;
}

const RegionPerformanceTable: React.FC<RegionPerformanceTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Order</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Top Product</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((region) => (
            <tr key={region.region}>
              <td className="px-6 py-4 whitespace-nowrap">{region.region}</td>
              <td className="px-6 py-4 whitespace-nowrap">${region.totalSales.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">{region.orderCount}</td>
              <td className="px-6 py-4 whitespace-nowrap">${region.averageOrderValue.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {region.topProducts[0]?.name || 'N/A'}
                {region.topProducts[0] && (
                  <span className="text-gray-500 text-sm ml-2">
                    (${region.topProducts[0].revenue.toFixed(2)})
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegionPerformanceTable;