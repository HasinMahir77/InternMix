import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { UploadCloud, Github } from 'lucide-react';
import { getUserReposSummary, extractUsernameFromUrl } from '../utils/github';

const Resume = () => {
  const { isAuthenticated } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [githubData, setGithubData] = useState<{
    languages: string[];
    repos: string[];
    repoLanguageMap: Record<string, string>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const extractGitHubInfo = async (githubUrl: string) => {
    const username = extractUsernameFromUrl(githubUrl);
    if (!username) {
      throw new Error('Invalid GitHub URL. Please enter a valid GitHub profile URL.');
    }
    
    // Get GitHub token from environment variable
    const token = import.meta.env.VITE_GITHUB_TOKEN;
    
    const githubDataResult = await getUserReposSummary(username, token);
    
    // Store the GitHub data
    setGithubData(githubDataResult);
    
    // Log the repo:language mapping to console as requested
    console.log('GitHub Repository Language Mapping:');
    console.log(githubDataResult.repoLanguageMap);
    
    // Also log the full data structure
    console.log('Full GitHub Data:', githubDataResult);
    
    return githubDataResult;
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (githubUrl) {
        await extractGitHubInfo(githubUrl);
        setIsUploaded(true);
      } else if (resumeFile) {
        // Handle resume file upload (existing logic)
        setIsUploaded(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing your request.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdate = () => {
    setIsUploaded(false);
    setResumeFile(null);
    setGithubUrl('');
    setGithubData(null);
    setError(null);
  };


  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Your Resume</h1>
        
        {!isUploaded ? (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Upload Resume */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Upload Resume</h3>
                <p className="text-sm text-gray-500 mt-1">Europass PDF</p>
                <input type="file" id="resume-upload" className="hidden" onChange={handleFileChange} />
                <label htmlFor="resume-upload" className="mt-4 bg-primary-100 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-primary-200 transition-colors">
                  Choose File
                </label>
                {resumeFile && <p className="text-sm text-gray-600 mt-2">{resumeFile.name}</p>}
              </div>

              {/* Link GitHub */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Github className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">Link GitHub Profile</h3>
                <p className="text-sm text-gray-500 mt-1">Showcase your projects</p>
                <input
                  type="text"
                  placeholder="https://github.com/your-profile"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="mt-4 w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            <div className="mt-8 text-center">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <button
                onClick={handleUpload}
                disabled={(!resumeFile && !githubUrl) || isLoading}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  'Extract Information'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Extracted Information</h2>
              <button
                onClick={handleUpdate}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Upload New
              </button>
            </div>

                        {!githubData ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No information extracted yet. Link your GitHub profile to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {/* GitHub Projects */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Github className="h-8 w-8 text-orange-600" />
                    <h3 className="text-lg font-semibold text-orange-900">GitHub Projects</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-orange-800 mb-2">Languages Used:</p>
                      <div className="flex flex-wrap gap-2">
                        {githubData.languages.map(lang => (
                          <span key={lang} className="bg-orange-200 text-orange-800 px-2.5 py-1 rounded-full text-sm font-medium">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-orange-800 mb-2">Repository Languages:</p>
                      <div className="space-y-1">
                        {Object.entries(githubData.repoLanguageMap).map(([repo, lang]) => (
                          <div key={repo} className="text-sm text-orange-700">
                            <span className="font-medium">{repo}:</span> {lang}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume; 