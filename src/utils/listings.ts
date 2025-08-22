// API service for listing operations
import { getToken } from './auth';

export interface ListingCreateRequest {
  title: string;
  description: string;
  degree: string;
  subject: string;
  recommended_cgpa?: number;
  duration_months: number;
  location: string;
  is_remote: boolean;
  required_skills: string[];
  optional_skills: string[];
  deadline: string;
}

export interface ListingUpdateRequest {
  title?: string;
  description?: string;
  degree?: string;
  subject?: string;
  recommended_cgpa?: number;
  duration_months?: number;
  location?: string;
  is_remote?: boolean;
  required_skills?: string[];
  optional_skills?: string[];
  deadline?: string;
  archived?: boolean;
}

export interface ListingResponse {
  id: number;
  title: string;
  description: string;
  degree: string;
  subject: string;
  recommended_cgpa?: number;
  duration_months: number;
  location: string;
  is_remote: boolean;
  required_skills: string[];
  optional_skills: string[];
  deadline: string;
  archived: boolean;
  created_by: string;
  created_by_name: string;
  created_at: string;
  applications_count: number;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Create a new listing
export const createListing = async (data: ListingCreateRequest): Promise<ListingResponse> => {
  const response = await fetch(`${API_BASE}/api/listings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to create listing');
  }

  return response.json();
};

// Get all listings (optionally filtered by archived status)
export const getListings = async (archived: boolean = false): Promise<ListingResponse[]> => {
  const response = await fetch(`${API_BASE}/api/listings?archived=${archived}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch listings');
  }

  return response.json();
};

// Get a specific listing by ID
export const getListing = async (id: number): Promise<ListingResponse> => {
  const response = await fetch(`${API_BASE}/api/listings/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to fetch listing');
  }

  return response.json();
};

// Update a listing
export const updateListing = async (id: number, data: ListingUpdateRequest): Promise<ListingResponse> => {
  const response = await fetch(`${API_BASE}/api/listings/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to update listing');
  }

  return response.json();
};

// Delete a listing
export const deleteListing = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/api/listings/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to delete listing');
  }
};

// Toggle archive status of a listing
export const toggleArchiveListing = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE}/api/listings/${id}/archive`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || 'Failed to toggle archive status');
  }
};
