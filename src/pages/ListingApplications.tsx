import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import { Loader2, Users, BadgeCheck } from 'lucide-react';
import { getScoredApplicationsForListing, type ScoredApplicationEntry } from '../utils/recruiter';

const ListingApplications: React.FC = () => {
  const { isAuthenticated, userType } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listingTitle, setListingTitle] = useState<string>('');
  const [apps, setApps] = useState<ScoredApplicationEntry[]>([]);

  const listingId = Number(searchParams.get('listingId'));

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated || userType !== 'recruiter' || !listingId) return;
      try {
        setLoading(true);
        const data = await getScoredApplicationsForListing(listingId);
        setListingTitle(data.listing.title);
        setApps(data.applications);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, userType, listingId]);

  if (!isAuthenticated || userType !== 'recruiter') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
          <div className="text-gray-600">Listing: <span className="font-semibold">{listingTitle || `#${listingId}`}</span></div>
        </div>

        {loading && (
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Ranking applicants...</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">{error}</div>
        )}

        {!loading && !error && (
          <div className="space-y-4">
            {apps.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-600">
                <Users className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                No applications yet.
              </div>
            ) : (
              apps.map((a) => (
                <div key={a.application_id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={a.intern.profile_image_url || ''} onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-semibold text-gray-900">{a.intern.first_name} {a.intern.last_name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">{a.intern.degree || 'N/A'}{a.intern.major ? ` • ${a.intern.major}` : ''}</span>
                      </div>
                      <div className="text-sm text-gray-600">CGPA: {a.intern.cgpa ?? 'N/A'}</div>
                      <div className="text-xs text-gray-500">{a.applied_at ? new Date(a.applied_at).toLocaleString() : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-700">Match</div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${Math.round((a.similarity_score || 0) * 100)}%` }}></div>
                        </div>
                        <span className="text-sm text-gray-700 font-semibold">{Math.round((a.similarity_score || 0) * 100)}%</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                      <BadgeCheck className="h-3 w-3 mr-1" /> {a.status.replace('_',' ')}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingApplications;


