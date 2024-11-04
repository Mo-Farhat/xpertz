import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";

interface SatisfactionMetricsProps {
  data: Array<{
    rating: number;
    sentiment: 'positive' | 'neutral' | 'negative';
    category: string;
  }>;
}

const SatisfactionMetrics: React.FC<SatisfactionMetricsProps> = ({ data }) => {
  const averageRating = data.reduce((sum, item) => sum + item.rating, 0) / data.length || 0;
  const positiveCount = data.filter(item => item.sentiment === 'positive').length;
  const negativeCount = data.filter(item => item.sentiment === 'negative').length;
  const satisfactionRate = (positiveCount / data.length) * 100 || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Average Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {averageRating.toFixed(1)}/5
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Satisfaction Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {satisfactionRate.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Positive Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">
            {positiveCount}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Negative Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">
            {negativeCount}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SatisfactionMetrics;