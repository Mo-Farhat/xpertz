import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save, Trash2 } from 'lucide-react';

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewDate: Date;
  reviewPeriod: string;
  overallRating: number;
  strengths: string;
  areasForImprovement: string;
  goals: string;
  status: 'draft' | 'submitted' | 'approved';
}

const PerformanceEvaluation: React.FC = () => {
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [newReview, setNewReview] = useState<Omit<PerformanceReview, 'id'>>({
    employeeId: '',
    employeeName: '',
    reviewerId: '',
    reviewerName: '',
    reviewDate: new Date(),
    reviewPeriod: '',
    overallRating: 0,
    strengths: '',
    areasForImprovement: '',
    goals: '',
    status: 'draft',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'performanceReviews'), orderBy('reviewDate', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reviews = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        reviewDate: doc.data().reviewDate.toDate(),
      } as PerformanceReview));
      setPerformanceReviews(reviews);
    });
    return unsubscribe;
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'performanceReviews'), {
        ...newReview,
        reviewDate: new Date(newReview.reviewDate),
      });
      setNewReview({
        employeeId: '',
        employeeName: '',
        reviewerId: '',
        reviewerName: '',
        reviewDate: new Date(),
        reviewPeriod: '',
        overallRating: 0,
        strengths: '',
        areasForImprovement: '',
        goals: '',
        status: 'draft',
      });
    } catch (error) {
      console.error("Error adding performance review: ", error);
    }
  };

  const handleUpdateReview = async (id: string, updatedReview: Partial<PerformanceReview>) => {
    try {
      await updateDoc(doc(db, 'performanceReviews', id), updatedReview);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating performance review: ", error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'performanceReviews', id));
    } catch (error) {
      console.error("Error deleting performance review: ", error);
    }
  };

  const handleExport = () => {
    const csvContent = performanceReviews.map(review => 
      `${review.employeeName},${review.reviewerName},${review.reviewDate.toISOString()},${review.reviewPeriod},${review.overallRating},${review.status}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'performance_reviews.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Performance Evaluation</h3>
      <form onSubmit={handleAddReview} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Employee ID"
            value={newReview.employeeId}
            onChange={(e) => setNewReview({ ...newReview, employeeId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Employee Name"
            value={newReview.employeeName}
            onChange={(e) => setNewReview({ ...newReview, employeeName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Reviewer ID"
            value={newReview.reviewerId}
            onChange={(e) => setNewReview({ ...newReview, reviewerId: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Reviewer Name"
            value={newReview.reviewerName}
            onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newReview.reviewDate.toISOString().split('T')[0]}
            onChange={(e) => setNewReview({ ...newReview, reviewDate: new Date(e.target.value) })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Review Period"
            value={newReview.reviewPeriod}
            onChange={(e) => setNewReview({ ...newReview, reviewPeriod: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Overall Rating"
            value={newReview.overallRating}
            onChange={(e) => setNewReview({ ...newReview, overallRating: parseInt(e.target.value) })}
            className="p-2 border rounded"
          />
          <select
            value={newReview.status}
            onChange={(e) => setNewReview({ ...newReview, status: e.target.value as 'draft' | 'submitted' | 'approved' })}
            className="p-2 border rounded"
          >
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        <textarea
          placeholder="Strengths"
          value={newReview.strengths}
          onChange={(e) => setNewReview({ ...newReview, strengths: e.target.value })}
          className="p-2 border rounded w-full mt-4"
        />
        <textarea
          placeholder="Areas for Improvement"
          value={newReview.areasForImprovement}
          onChange={(e) => setNewReview({ ...newReview, areasForImprovement: e.target.value })}
          className="p-2 border rounded w-full mt-4"
        />
        <textarea
          placeholder="Goals"
          value={newReview.goals}
          onChange={(e) => setNewReview({ ...newReview, goals: e.target.value })}
          className="p-2 border rounded w-full mt-4"
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          <Plus size={24} /> Add Performance Review
        </button>
      </form>
      <button
        onClick={handleExport}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
      >
        <Download size={18} className="mr-2" />
        Export CSV
      </button>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Employee</th>
            <th className="py-3 px-6 text-left">Reviewer</th>
            <th className="py-3 px-6 text-left">Review Date</th>
            <th className="py-3 px-6 text-left">Period</th>
            <th className="py-3 px-6 text-center">Rating</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {performanceReviews.map((review) => (
            <tr key={review.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">{review.employeeName}</td>
              <td className="py-3 px-6 text-left">{review.reviewerName}</td>
              <td className="py-3 px-6 text-left">{review.reviewDate.toLocaleDateString()}</td>
              <td className="py-3 px-6 text-left">{review.reviewPeriod}</td>
              <td className="py-3 px-6 text-center">{review.overallRating}</td>
              <td className="py-3 px-6 text-left">
                <span className={`py-1 px-3 rounded-full text-xs ${
                  review.status === 'approved' ? 'bg-green-200 text-green-800' :
                  review.status === 'submitted' ? 'bg-yellow-200 text-yellow-800' :
                  'bg-gray-200 text-gray-800'
                }`}>
                  {review.status}
                </span>
              </td>
              <td className="py-3 px-6 text-center">
                <button
                  onClick={() => setEditingId(review.id)}
                  className="text-blue-500 hover:text-blue-700 mr-2"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceEvaluation;