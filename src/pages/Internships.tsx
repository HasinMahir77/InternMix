import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { MapPin, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { getStudentRecommendations, type ScoredListing, applyForInternship, getStudentApplications, type StudentApplication } from '../utils/student';

type UIListing = {
  data: ScoredListing;
  company: string;
};

const Internships = () => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<UIListing[]>([]);
  const [selected, setSelected] = useState<UIListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        const [recs, apps] = await Promise.all([
          getStudentRecommendations(),
          getStudentApplications()
        ]);
        const appliedSet = new Set<number>((apps as StudentApplication[]).map(a => a.listing_id));
        const ui = recs.map(r => ({
          data: r,
          company: r.listing.created_by_name || r.listing.created_by || 'Company',
        }));
        setItems(ui);
        setSelected(ui[0] || null);
        setAppliedIds(appliedSet);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Internships</h1>
        <p className="text-gray-600 mb-8">Based on your profile and resume, here are the best matches for you.</p>
        {loading && (
          <div className="flex items-center space-x-2 text-gray-600 mb-6">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Fetching recommendations...</span>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-800">{error}</div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Internship List */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-3">
              {items.map((it) => (
                <div
                  key={it.data.listing.id}
                  onClick={() => setSelected(it)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${selected?.data.listing.id === it.data.listing.id ? 'bg-primary-50 shadow-md border border-primary-200' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    {it.data.listing.created_by_profile_image_url ? (
                      <img
                        src={it.data.listing.created_by_profile_image_url}
                        alt={it.company}
                        className="h-8 w-8 rounded object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                        {it.company?.slice(0,2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{it.data.listing.title}</h3>
                      <p className="text-sm text-gray-600">{it.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{it.data.listing.is_remote ? 'Remote' : it.data.listing.location}</span>
                    </div>
                    <span className="font-bold text-primary-600">{Math.round((it.data.final_score || 0) * 100)}% Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internship Details */}
          <div className="w-full md:w-2/3">
            {selected && (
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selected.data.listing.title}</h2>
                        <p className="text-lg text-gray-600 font-medium">{selected.company}</p>
                        <div className="flex items-center space-x-2 text-gray-500 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{selected.data.listing.is_remote ? 'Remote' : selected.data.listing.location}</span>
                        </div>
                    </div>
                    {selected.data.listing.created_by_profile_image_url ? (
                      <img
                        src={selected.data.listing.created_by_profile_image_url}
                        alt={selected.company}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                        {selected.company?.slice(0,2).toUpperCase()}
                      </div>
                    )}
                </div>
                
                <div className="border-t border-gray-200 my-6"></div>

                <h3 className="font-semibold text-gray-800 mb-2">Job Description</h3>
                <p className="text-gray-600 mb-6">{selected.data.listing.description}</p>
                
                <h3 className="font-semibold text-gray-800 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    {selected.data.listing.required_skills.map((skill: string) => (
                        <span key={skill} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                    ))}
                </div>
                {selected.data.listing.optional_skills.length > 0 && (
                  <>
                    <h3 className="font-semibold text-gray-800 mb-2">Nice to have</h3>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {selected.data.listing.optional_skills.map((skill: string) => (
                        <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                      ))}
                    </div>
                  </>
                )}

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={async () => {
                      if (!selected) return;
                      const id = selected.data.listing.id;
                      if (appliedIds.has(id)) return;
                      try {
                        await applyForInternship(id);
                        setAppliedIds(prev => new Set(prev).add(id));
                      } catch (e) {
                        alert(e instanceof Error ? e.message : 'Failed to apply');
                      }
                    }}
                    disabled={selected ? appliedIds.has(selected.data.listing.id) : false}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${selected && appliedIds.has(selected.data.listing.id) ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700'} text-white disabled:opacity-80`}
                  >
                    <CheckCircle className="h-5 w-5"/>
                    <span>{selected && appliedIds.has(selected.data.listing.id) ? 'Applied' : 'Apply Now'}</span>
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <ExternalLink className="h-5 w-5"/>
                    <span>View on Company Site</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Internships;