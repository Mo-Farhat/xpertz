import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Plus, Download, Edit, Save, Trash2 } from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string;
  requirements: string;
  status: 'open' | 'closed';
  postedDate: Date;
}

interface Applicant {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  status: 'applied' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';
  appliedDate: Date;
}

const RecruitmentOnboarding: React.FC = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [newJobPosting, setNewJobPosting] = useState<Omit<JobPosting, 'id'>>({
    title: '',
    department: '',
    description: '',
    requirements: '',
    status: 'open',
    postedDate: new Date(),
  });
  const [newApplicant, setNewApplicant] = useState<Omit<Applicant, 'id'>>({
    jobId: '',
    name: '',
    email: '',
    phone: '',
    resumeUrl: '',
    status: 'applied',
    appliedDate: new Date(),
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const jobsQuery = query(collection(db, 'jobPostings'), orderBy('postedDate', 'desc'));
    const applicantsQuery = query(collection(db, 'applicants'), orderBy('appliedDate', 'desc'));

    const unsubscribeJobs = onSnapshot(jobsQuery, (querySnapshot) => {
      const jobs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        postedDate: doc.data().postedDate.toDate(),
      } as JobPosting));
      setJobPostings(jobs);
    });

    const unsubscribeApplicants = onSnapshot(applicantsQuery, (querySnapshot) => {
      const applicantsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appliedDate: doc.data().appliedDate.toDate(),
      } as Applicant));
      setApplicants(applicantsData);
    });

    return () => {
      unsubscribeJobs();
      unsubscribeApplicants();
    };
  }, []);

  const handleAddJobPosting = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'jobPostings'), {
        ...newJobPosting,
        postedDate: new Date(),
      });
      setNewJobPosting({
        title: '',
        department: '',
        description: '',
        requirements: '',
        status: 'open',
        postedDate: new Date(),
      });
    } catch (error) {
      console.error("Error adding job posting: ", error);
    }
  };

  const handleAddApplicant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'applicants'), {
        ...newApplicant,
        appliedDate: new Date(),
      });
      setNewApplicant({
        jobId: '',
        name: '',
        email: '',
        phone: '',
        resumeUrl: '',
        status: 'applied',
        appliedDate: new Date(),
      });
    } catch (error) {
      console.error("Error adding applicant: ", error);
    }
  };

  const handleUpdateJobPosting = async (id: string, updatedJob: Partial<JobPosting>) => {
    try {
      await updateDoc(doc(db, 'jobPostings', id), updatedJob);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating job posting: ", error);
    }
  };

  const handleUpdateApplicant = async (id: string, updatedApplicant: Partial<Applicant>) => {
    try {
      await updateDoc(doc(db, 'applicants', id), updatedApplicant);
      setEditingId(null);
    } catch (error) {
      console.error("Error updating applicant: ", error);
    }
  };

  const handleDeleteJobPosting = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'jobPostings', id));
    } catch (error) {
      console.error("Error deleting job posting: ", error);
    }
  };

  const handleDeleteApplicant = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'applicants', id));
    } catch (error) {
      console.error("Error deleting applicant: ", error);
    }
  };

  const handleExportJobPostings = () => {
    const csvContent = jobPostings.map(job => 
      `${job.title},${job.department},${job.description},${job.requirements},${job.status},${job.postedDate.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'job_postings.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportApplicants = () => {
    const csvContent = applicants.map(applicant => 
      `${applicant.name},${applicant.email},${applicant.phone},${applicant.resumeUrl},${applicant.status},${applicant.appliedDate.toISOString()}`
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'applicants.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Recruitment & Onboarding</h3>
      
      {/* Job Postings Section */}
      <div className="mb-8">
        <h4 className="text-lg font-semibold mb-2">Job Postings</h4>
        <form onSubmit={handleAddJobPosting} className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Job Title"
              value={newJobPosting.title}
              onChange={(e) => setNewJobPosting({ ...newJobPosting, title: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Department"
              value={newJobPosting.department}
              onChange={(e) => setNewJobPosting({ ...newJobPosting, department: e.target.value })}
              className="p-2 border rounded"
            />
            <textarea
              placeholder="Job Description"
              value={newJobPosting.description}
              onChange={(e) => setNewJobPosting({ ...newJobPosting, description: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <textarea
              placeholder="Requirements"
              value={newJobPosting.requirements}
              onChange={(e) => setNewJobPosting({ ...newJobPosting, requirements: e.target.value })}
              className="p-2 border rounded col-span-2"
            />
            <select
              value={newJobPosting.status}
              onChange={(e) => setNewJobPosting({ ...newJobPosting, status: e.target.value as 'open' | 'closed' })}
              className="p-2 border rounded"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Plus size={24} /> Add Job Posting
          </button>
        </form>
        <button
          onClick={handleExportJobPostings}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Job Postings CSV
        </button>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Department</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Posted Date</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {jobPostings.map((job) => (
              <tr key={job.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{job.title}</td>
                <td className="py-3 px-6 text-left">{job.department}</td>
                <td className="py-3 px-6 text-left">
                  <span className={`py-1 px-3 rounded-full text-xs ${
                    job.status === 'open' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{job.postedDate.toLocaleDateString()}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setEditingId(job.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteJobPosting(job.id)}
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

      {/* Applicants Section */}
      <div>
        <h4 className="text-lg font-semibold mb-2">Applicants</h4>
        <form onSubmit={handleAddApplicant} className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={newApplicant.jobId}
              onChange={(e) => setNewApplicant({ ...newApplicant, jobId: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="">Select Job</option>
              {jobPostings.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Applicant Name"
              value={newApplicant.name}
              onChange={(e) => setNewApplicant({ ...newApplicant, name: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={newApplicant.email}
              onChange={(e) => setNewApplicant({ ...newApplicant, email: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={newApplicant.phone}
              onChange={(e) => setNewApplicant({ ...newApplicant, phone: e.target.value })}
              className="p-2 border rounded"
            />
            <input
              type="url"
              placeholder="Resume URL"
              value={newApplicant.resumeUrl}
              onChange={(e) => setNewApplicant({ ...newApplicant, resumeUrl: e.target.value })}
              className="p-2 border rounded"
            />
            <select
              value={newApplicant.status}
              onChange={(e) => setNewApplicant({ ...newApplicant, status: e.target.value as Applicant['status'] })}
              className="p-2 border rounded"
            >
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="interview">Interview</option>
              <option value="offered">Offered</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            <Plus size={24} /> Add Applicant
          </button>
        </form>
        <button
          onClick={handleExportApplicants}
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
        >
          <Download size={18} className="mr-2" />
          Export Applicants CSV
        </button>
        <table className="w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Job</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Applied Date</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {applicants.map((applicant) => (
              <tr key={applicant.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{applicant.name}</td>
                <td className="py-3 px-6 text-left">{applicant.email}</td>
                <td className="py-3 px-6 text-left">{applicant.phone}</td>
                <td className="py-3 px-6 text-left">
                  {jobPostings.find(job => job.id === applicant.jobId)?.title || 'N/A'}
                </td>
                <td className="py-3 px-6 text-left">
                  <span className={`py-1 px-3 rounded-full text-xs ${
                    applicant.status === 'hired' ? 'bg-green-200 text-green-800' :
                    applicant.status === 'rejected' ? 'bg-red-200 text-red-800' :
                    'bg-yellow-200 text-yellow-800'
                  }`}>
                    {applicant.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-left">{applicant.appliedDate.toLocaleDateString()}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => setEditingId(applicant.id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteApplicant(applicant.id)}
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
    </div>
  );
};

export default RecruitmentOnboarding;