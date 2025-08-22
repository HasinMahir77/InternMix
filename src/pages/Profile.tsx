import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Edit3, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getStudentProfile, updateStudentProfile, uploadProfileImage, type StudentProfile, type StudentProfileUpdate } from '../utils/student';

const Profile = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [editData, setEditData] = useState<StudentProfileUpdate>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getStudentProfile();
        setProfile(data);
        setEditData({
          first_name: data.first_name,
          last_name: data.last_name,
          phone_num: data.phone_num || '',
          address: data.address || '',
          institution: data.institution || '',
          degree: data.degree || '',
          major: data.major || '',
          cgpa: data.cgpa || 0,
          github_url: data.github_url || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h2>
          <p className="text-gray-600">Unable to load your profile information.</p>
        </div>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setSaving(true);
        setError(null);
        const resp = await uploadProfileImage(e.target.files[0]);
        // Refresh profile to get new URL
        const updatedProfile = await getStudentProfile();
        setProfile(updatedProfile);
        setSuccess('Profile image updated');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload profile image');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await updateStudentProfile(editData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh profile data
      const updatedProfile = await getStudentProfile();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone_num: profile.phone_num || '',
      address: profile.address || '',
      institution: profile.institution || '',
      degree: profile.degree || '',
      major: profile.major || '',
      cgpa: profile.cgpa || 0,
      github_url: profile.github_url || '',
    });
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Success Display */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>{success}</span>
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <div className="flex space-x-2">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-center md:items-start md:space-x-8">
              <div className="relative mb-6 md:mb-0">
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600 border-4 border-white shadow-md">
                    {(profile.first_name[0] + (profile.last_name?.[0] || '')).toUpperCase()}
                  </div>
                )}
                {isEditing && (
                  <label
                    htmlFor="profilePicture"
                    className="absolute bottom-0 right-0 bg-primary-600 p-2 rounded-full text-white cursor-pointer hover:bg-primary-700 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                    <input
                      id="profilePicture"
                      name="profilePicture"
                      type="file"
                      className="hidden"
                      onChange={handlePictureChange}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500">First Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="first_name" 
                      value={editData.first_name || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" 
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold text-gray-900">{profile.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Name</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="last_name" 
                      value={editData.last_name || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" 
                    />
                  ) : (
                    <p className="mt-1 text-lg font-semibold text-gray-900">{profile.last_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="phone_num" 
                      value={editData.phone_num || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" 
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile.phone_num || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="address" 
                      value={editData.address || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" 
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile.address || 'Not provided'}</p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-lg text-gray-800">{profile.email}</p>
                  <p className="text-sm text-gray-500">Email cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Institution</label>
                  {isEditing ? (
                    <input 
                      type="text" 
                      name="institution" 
                      value={editData.institution || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" 
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile.institution || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Degree</label>
                  {isEditing ? (
                    <select 
                      name="degree" 
                      value={editData.degree || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" 
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
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile.degree || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Major</label>
                  {isEditing ? (
                    <select 
                      name="major" 
                      value={editData.major || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">Select major</option>
                      <option value="Management">Management</option>
                      <option value="MIS">MIS</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Finance">Finance</option>
                      <option value="Design">Design</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile.major || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">CGPA</label>
                  {isEditing ? (
                    <input 
                      type="number" 
                      name="cgpa" 
                      min="0" 
                      max="4" 
                      step="0.01"
                      value={editData.cgpa || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" 
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile.cgpa || 'Not provided'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">GitHub URL</label>
                  {isEditing ? (
                    <input 
                      type="url" 
                      name="github_url" 
                      value={editData.github_url || ''} 
                      onChange={handleChange} 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" 
                    />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">
                      {profile.github_url ? (
                        <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                          {profile.github_url}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  )}
                </div>
                {isEditing && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-500">New Password (optional)</label>
                    <input 
                      type="password" 
                      name="password" 
                      placeholder="Leave blank to keep current password" 
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" 
                      onChange={handleChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 