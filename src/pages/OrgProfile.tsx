import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Edit3, Camera } from 'lucide-react';
import { getRecruiterProfile, updateRecruiterProfile, uploadRecruiterProfileImage, type RecruiterProfile, type RecruiterProfileUpdate } from '../utils/recruiter';

const OrgProfile = () => {
  const { isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [editData, setEditData] = useState<RecruiterProfileUpdate>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setError(null);
        const data = await getRecruiterProfile();
        setProfile(data);
        setEditData({
          organization_name: data.organization_name || '',
          first_name: data.first_name,
          last_name: data.last_name,
          designation: data.designation || '',
          phone: data.phone || '',
          website: data.website || '',
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load profile');
      }
    };
    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setSaving(true);
        await uploadRecruiterProfileImage(e.target.files[0]);
        const updated = await getRecruiterProfile();
        setProfile(updated);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to upload image');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);
      await updateRecruiterProfile(editData);
      const updated = await getRecruiterProfile();
      setProfile(updated);
      setIsEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900">Organization Profile</h1>
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? (saving ? 'Saving...' : 'Save Changes') : 'Edit Profile'}</span>
              </button>
            </div>

            <div className="mt-8 flex flex-col md:flex-row items-center md:items-start md:space-x-8">
              <div className="relative mb-6 md:mb-0">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="Profile"
                    className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-semibold text-gray-600 border-4 border-white shadow-md">
                    {(profile?.organization_name || 'Org').slice(0, 2).toUpperCase()}
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Organization Name</label>
                  {isEditing ? (
                    <input type="text" name="organization_name" value={editData.organization_name || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                  ) : (
                    <p className="mt-1 text-lg font-semibold text-gray-900">{profile?.organization_name || '—'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">First Name</label>
                  {isEditing ? (
                    <input type="text" name="first_name" value={editData.first_name || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile?.first_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Name</label>
                  {isEditing ? (
                    <input type="text" name="last_name" value={editData.last_name || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile?.last_name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Designation</label>
                  {isEditing ? (
                    <input type="text" name="designation" value={editData.designation || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile?.designation}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  {isEditing ? (
                    <input type="email" name="email" value={profile?.email || ''} onChange={() => {}} disabled className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100" />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile?.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  {isEditing ? (
                    <input type="text" name="phone" value={editData.phone || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile?.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Website</label>
                  {isEditing ? (
                    <input type="url" name="website" value={editData.website || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500" />
                  ) : (
                    <p className="mt-1 text-lg text-gray-800">{profile?.website || '—'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgProfile; 