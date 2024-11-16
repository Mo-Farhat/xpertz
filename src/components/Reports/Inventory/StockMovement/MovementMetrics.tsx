import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { MovementMetrics } from '../types';

interface MovementMetricsCardsProps {
  metrics: MovementMetrics;
}

const MovementMetricsCards: React.FC<MovementMetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Inbound</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">+{metrics.inbound}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Outbound</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">-{metrics.outbound}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Net Change</CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${metrics.netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.netChange >= 0 ? '+' : ''}{metrics.netChange}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovementMetricsCards;