import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { PlusCircle, Archive, Pen, RotateCcw } from 'lucide-react';

interface Listing {
  id: number;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  deadline: string;
  archived: boolean;
}

const Listings: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  const [listings, setListings] = useState<Listing[]>([
    {
      id: 1,
      title: 'Frontend Web Developer Intern',
      description: 'Work with our product team to build responsive web interfaces and refine design systems.',
      skills: ['React', 'TypeScript', 'CSS'],
      duration: '12 Weeks',
      deadline: '2024-08-15',
      archived: false,
    },
    {
      id: 2,
      title: 'Data Science Intern',
      description: 'Analyze large datasets to extract actionable insights and help improve recommendation algorithms.',
      skills: ['Python', 'Pandas', 'Machine Learning'],
      duration: '16 Weeks',
      deadline: '2024-09-01',
      archived: false,
    },
    {
      id: 3,
      title: 'Product Management Intern',
      description: 'Assist the PM team in defining product roadmaps, conducting market research, and coordinating cross-functional initiatives.',
      skills: ['Agile', 'Communication', 'Market Research'],
      duration: '10 Weeks',
      deadline: '2024-08-30',
      archived: false,
    },
  ]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    duration: '',
    deadline: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  if (!isAuthenticated || userType !== 'recruiter') {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', skills: '', duration: '', deadline: '' });
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const payload: Listing = {
      id: editingId ?? Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      skills: formData.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      duration: formData.duration.trim(),
      deadline: formData.deadline,
      archived: false,
    };

    setListings((prev) => {
      if (editingId === null) {
        return [...prev, payload];
      }
      return prev.map((l) => (l.id === editingId ? payload : l));
    });

    resetForm();
  };

  const handleEdit = (listing: Listing) => {
    setEditingId(listing.id);
    setFormData({
      title: listing.title,
      description: listing.description,
      skills: listing.skills.join(', '),
      duration: listing.duration,
      deadline: listing.deadline,
    });
  };

  const toggleArchive = (id: number) => {
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, archived: !l.archived } : l))
    );
  };

  const activeListings = listings.filter((l) => !l.archived);
  const archivedListings = listings.filter((l) => l.archived);

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Internship Listings</h1>

        {/* Create / Edit Form */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <PlusCircle className="h-5 w-5" />
            <span>{editingId ? 'Edit Listing' : 'Create New Listing'}</span>
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input
                type="text"
                name="duration"
                placeholder="e.g., 12 weeks"
                value={formData.duration}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div className="md:col-span-2 flex items-center space-x-4">
              <button
                type="submit"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                {editingId ? 'Save Changes' : 'Create Listing'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Active Listings */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Active Listings</h2>
          {activeListings.length > 0 ? (
            <div className="space-y-6">
              {activeListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{listing.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{listing.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {listing.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500">Duration: {listing.duration}</p>
                      <p className="text-sm text-gray-500">Deadline: {listing.deadline}</p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEdit(listing)}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100"
                      >
                        <Pen className="h-4 w-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => toggleArchive(listing.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                      >
                        <Archive className="h-4 w-4 mr-1" /> Archive
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No active listings.</p>
          )}
        </div>

        {/* Archived Listings */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Archived Listings</h2>
          {archivedListings.length > 0 ? (
            <div className="space-y-6">
              {archivedListings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 line-through">{listing.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-through">{listing.description}</p>
                    </div>
                    <div>
                      <button
                        onClick={() => toggleArchive(listing.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" /> Restore
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No archived listings.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings; 