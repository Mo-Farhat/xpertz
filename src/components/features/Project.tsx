import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Folder, Edit, Trash2, Save, X, Plus } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

const Project: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', status: 'Not Started' as const });
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'projects'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects: ", error);
      setError('Failed to fetch projects. Please try again.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.description) {
      setError('Name and description are required.');
      return;
    }
    try {
      await addDoc(collection(db, 'projects'), newProject);
      setNewProject({ name: '', description: '', status: 'Not Started' });
      setError('');
    } catch (error) {
      console.error("Error adding project: ", error);
      setError('Failed to add project. Please try again.');
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      console.error("Error deleting project: ", error);
      setError('Failed to delete project. Please try again.');
    }
  };

  const handleEditProject = async (id: string, updatedProject: Partial<Project>) => {
    try {
      await updateDoc(doc(db, 'projects', id), updatedProject);
      setEditingProject(null);
    } catch (error) {
      console.error("Error updating project: ", error);
      setError('Failed to update project. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Project Management</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddProject} className="mb-8">
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Project Name"
              className="w-full p-2 border rounded"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
            />
          </div>
          <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
          </div>
          <div className="w-full md:w-1/3 px-2">
            <select
              className="w-full p-2 border rounded"
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value as Project['status'] })}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center">
          <Plus size={16} className="mr-2" />
          Add Project
        </button>
      </form>
      <div className="bg-white shadow-md rounded my-6">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  <div className="flex items-center">
                    <Folder size={16} className="mr-2" />
                    {editingProject === project.id ? (
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleEditProject(project.id, { name: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      <span>{project.name}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-6 text-left">
                  {editingProject === project.id ? (
                    <input
                      type="text"
                      value={project.description}
                      onChange={(e) => handleEditProject(project.id, { description: e.target.value })}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <span>{project.description}</span>
                  )}
                </td>
                <td className="py-3 px-6 text-left">
                  {editingProject === project.id ? (
                    <select
                      value={project.status}
                      onChange={(e) => handleEditProject(project.id, { status: e.target.value as Project['status'] })}
                      className="border rounded px-2 py-1"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <span className={`py-1 px-3 rounded-full text-xs ${
                      project.status === 'Not Started' ? 'bg-red-200 text-red-800' :
                      project.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' :
                      'bg-green-200 text-green-800'
                    }`}>
                      {project.status}
                    </span>
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingProject === project.id ? (
                    <>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="text-green-500 hover:text-green-600 mr-2"
                      >
                        <Save size={16} />
                      </button>
                      <button
                        onClick={() => setEditingProject(null)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingProject(project.id)}
                        className="text-blue-500 hover:text-blue-600 mr-2"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Project;