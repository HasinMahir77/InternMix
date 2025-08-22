import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { PlusCircle, Archive, Pen, RotateCcw, Users, Loader2 } from 'lucide-react';
import { 
  createListing, 
  getListings, 
  updateListing, 
  toggleArchiveListing,
  type ListingResponse,
  type ListingCreateRequest
} from '../utils/listings';





const Listings: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();

  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    degree: '',
    subject: '',
    recommendedCgpa: '',
    durationMonths: '',
    location: '',
    isRemote: false,
    requiredSkills: '',
    optionalSkills: '',
    deadline: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Fetch listings on component mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const [activeListings, archivedListings] = await Promise.all([
          getListings(false), // active listings
          getListings(true),  // archived listings
        ]);
        setListings([...activeListings, ...archivedListings]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && userType === 'recruiter') {
      fetchListings();
    }
  }, [isAuthenticated, userType]);

  if (!isAuthenticated || userType !== 'recruiter') {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      degree: '',
      subject: '',
      recommendedCgpa: '',
      durationMonths: '',
      location: '',
      isRemote: false,
      requiredSkills: '',
      optionalSkills: '',
      deadline: '',
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const listingData: ListingCreateRequest = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        degree: formData.degree,
        subject: formData.subject,
        recommended_cgpa: formData.recommendedCgpa ? parseFloat(formData.recommendedCgpa) : undefined,
        duration_months: formData.durationMonths ? parseInt(formData.durationMonths, 10) : 0,
        location: formData.location.trim(),
        is_remote: formData.isRemote,
        required_skills: formData.requiredSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        optional_skills: formData.optionalSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        deadline: formData.deadline,
      };

      if (editingId) {
        // Update existing listing
        const updatedListing = await updateListing(editingId, listingData);
        setListings(prev => prev.map(l => l.id === editingId ? updatedListing : l));
      } else {
        // Create new listing
        const newListing = await createListing(listingData);
        setListings(prev => [...prev, newListing]);
      }

      resetForm();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save listing');
    }
  };

  const handleEdit = (listing: ListingResponse) => {
    setEditingId(listing.id);
    setFormData({
      title: listing.title,
      description: listing.description,
      degree: listing.degree,
      subject: listing.subject,
      recommendedCgpa: listing.recommended_cgpa?.toString() || '',
      durationMonths: listing.duration_months.toString(),
      location: listing.location,
      isRemote: listing.is_remote,
      requiredSkills: listing.required_skills.join(', '),
      optionalSkills: listing.optional_skills.join(', '),
      deadline: listing.deadline,
    });
  };

  const toggleArchive = async (id: number) => {
    try {
      await toggleArchiveListing(id);
      setListings(prev => prev.map(l => l.id === id ? { ...l, archived: !l.archived } : l));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle archive status');
    }
  };

  const handleViewApplicants = () => {
    // For now, we'll show a placeholder since applications aren't implemented yet
    alert('Applications feature coming soon!');
  };

  const activeListings = listings.filter((l) => !l.archived);
  const archivedListings = listings.filter((l) => l.archived);

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Internship Listings</h1>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading Display */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600">Loading listings...</span>
          </div>
        )}

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <select
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">Select degree</option>
                <option value="BSc">BSc</option>
                <option value="BBA">BBA</option>
                <option value="BA">BA</option>
                <option value="MSc">MSc</option>
                <option value="MBA">MBA</option>
                <option value="PhD">PhD</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              >
                <option value="">Select subject</option>
                <option value="Management">Management</option>
                <option value="MIS">MIS</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Data Science">Data Science</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Design">Design</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recommended CGPA (out of 4)</label>
              <input
                type="number"
                name="recommendedCgpa"
                min={0}
                max={4}
                step={0.01}
                value={formData.recommendedCgpa}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
              <input
                type="number"
                name="durationMonths"
                min={1}
                value={formData.durationMonths}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Address</label>
              <input
                type="text"
                name="location"
                placeholder="e.g., Dhaka, Bangladesh"
                value={formData.location}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">Remote work available</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (comma separated)</label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Optional Skills (comma separated)</label>
              <input
                type="text"
                name="optionalSkills"
                value={formData.optionalSkills}
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
                        {listing.required_skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      {listing.optional_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {listing.optional_skills.map((skill: string) => (
                            <span
                              key={skill}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm text-gray-500">Degree: {listing.degree} • Subject: {listing.subject}</p>
                      {typeof listing.recommended_cgpa !== 'undefined' && (
                        <p className="text-sm text-gray-500">Recommended CGPA: {listing.recommended_cgpa}+</p>
                      )}
                      <p className="text-sm text-gray-500">Duration: {listing.duration_months} months</p>
                      <p className="text-sm text-gray-500">
                        Location: {listing.is_remote ? 'Remote' : listing.location}
                        {listing.is_remote && listing.location && ` (${listing.location})`}
                      </p>
                      <p className="text-sm text-gray-500">Deadline: {listing.deadline}</p>
                    </div>
                    <div className="flex flex-col space-y-2 items-end">
                      <button
                        onClick={() => handleViewApplicants()}
                        className="inline-flex items-center justify-center px-4 py-2 text-sm bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 w-40"
                      >
                        <Users className="h-4 w-4 mr-1" /> View Applications ({listing.applications_count})
                      </button>
                      <div className="flex space-x-2">
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