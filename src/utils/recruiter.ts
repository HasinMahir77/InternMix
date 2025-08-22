import { getToken } from './auth';

export interface RecruiterProfile {
  email: string;
  organization_name: string | null;
  first_name: string;
  last_name: string;
  designation: string | null;
  phone: string | null;
  profile_image_url: string | null;
  website: string | null;
  active: boolean;
  created_at: string | null;
}

export interface RecruiterProfileUpdate {
  organization_name?: string;
  first_name?: string;
  last_name?: string;
  designation?: string;
  phone?: string;
  website?: string;
  active?: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const getRecruiterProfile = async (): Promise<RecruiterProfile> => {
  const response = await fetch(`${API_BASE}/api/recruiter/profile`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch recruiter profile');
  }
  return response.json();
};

export const updateRecruiterProfile = async (payload: RecruiterProfileUpdate): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE}/api/recruiter/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update recruiter profile');
  }
  return response.json();
};

export const uploadRecruiterProfileImage = async (file: File): Promise<{ profile_image_url: string }> => {
  const token = getToken();
  const form = new FormData();
  form.append('file', file);
  const response = await fetch(`${API_BASE}/api/recruiter/profile/image`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: form,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to upload profile image');
  }
  return response.json();
};


