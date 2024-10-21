import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface ChartWidgetProps {
  title: string;
  isVisible: boolean;
  chart: React.ReactElement; // Change this from ReactNode to ReactElement
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ title, isVisible, chart }) => {
  if (!isVisible) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 hover:shadow-lg transition-all duration-300 ease-in-out">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        {chart}
      </ResponsiveContainer>
    </div>
  );
};

export default ChartWidget;