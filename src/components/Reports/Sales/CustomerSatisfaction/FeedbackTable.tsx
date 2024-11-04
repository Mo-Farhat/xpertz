import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table";
import { Badge } from "../../../ui/badge";

interface FeedbackTableProps {
  data: Array<{
    id: string;
    customerName: string;
    rating: number;
    comment: string;
    sentiment: 'positive' | 'neutral' | 'negative';
    category: string;
    createdAt: Date;
  }>;
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead>Comment</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((feedback) => (
            <TableRow key={feedback.id}>
              <TableCell>{feedback.customerName}</TableCell>
              <TableCell>{feedback.rating}/5</TableCell>
              <TableCell>{feedback.category}</TableCell>
              <TableCell>
                <Badge variant={
                  feedback.sentiment === 'positive' ? 'default' :
                  feedback.sentiment === 'negative' ? 'destructive' : 'secondary'
                }>
                  {feedback.sentiment}
                </Badge>
              </TableCell>
              <TableCell className="max-w-xs truncate">{feedback.comment}</TableCell>
              <TableCell>{feedback.createdAt.toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeedbackTable;