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

export interface ScoredApplicationEntry {
  application_id: number;
  intern: {
    email: string;
    first_name: string;
    last_name: string;
    degree: string | null;
    major: string | null;
    cgpa: number | null;
    profile_image_url: string | null;
    resume_url?: string | null;
  };
  status: string;
  similarity_score: number;
  components?: Record<string, number>;
  explanations?: Record<string, unknown>;
  applied_at: string | null;
}

export interface ScoredApplicationsResponse {
  listing: { id: number; title: string };
  applications: ScoredApplicationEntry[];
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

export const updateApplicationStatus = async (
  applicationId: number,
  status: 'accepted' | 'rejected' | 'pending' | 'waitlisted'
): Promise<{ message: string; status: string }> => {
  const response = await fetch(`${API_BASE}/api/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update status');
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

export const getScoredApplicationsForListing = async (listingId: number): Promise<ScoredApplicationsResponse> => {
  const response = await fetch(`${API_BASE}/api/listings/${listingId}/applications/scored`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch scored applications');
  }
  return response.json();
};


