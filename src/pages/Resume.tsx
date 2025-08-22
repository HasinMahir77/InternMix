import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { UploadCloud, Github, User, GraduationCap, Briefcase, Languages } from 'lucide-react';
import { getUserReposSummary, extractUsernameFromUrl } from '../utils/github';
import { setupPdfWorker, parseEuropassPdf, type InternMixCV } from '../utils/europass.util';
import { uploadResumePdf, saveParsedData } from '../utils/student';

// Normalize simple HTML (p/br) to plain text and strip other tags
function stripAndNormalizeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/\r\n|\r/g, '\n')
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/p\s*>\s*<\s*p\s*>/gi, '\n')
    .replace(/<\/?p\s*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const Resume = () => {
  const { isAuthenticated } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [parsedResume, setParsedResume] = useState<InternMixCV | null>(null);
  const [githubData, setGithubData] = useState<{
    languages: string[];
    repos: string[];
    repoLanguageMap: Record<string, string>;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfWorkerReady, setPdfWorkerReady] = useState(false);

  // Set up PDF worker when component mounts
  useEffect(() => {
    try {
      setupPdfWorker();
      setPdfWorkerReady(true);
      console.log('PDF worker setup completed successfully');
    } catch (error) {
      console.error('PDF worker setup failed:', error);
      setError('Failed to initialize PDF processing. Please refresh the page.');
      setPdfWorkerReady(false);
    }
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
      setError(null);
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
      if (resumeFile) {
        // Check if PDF worker is ready
        if (!pdfWorkerReady) {
          throw new Error('PDF processor is not ready. Please wait or refresh the page.');
        }
        
        // Parse Europass PDF
        console.log('Starting PDF parsing for file:', resumeFile.name);
        const parsedData = await parseEuropassPdf(resumeFile);
        setParsedResume(parsedData);
        console.log('Parsed Resume Data:', parsedData);
        // Upload the resume PDF to server
        try {
          await uploadResumePdf(resumeFile);
        } catch (e) {
          console.error('Resume upload failed:', e);
        }
      }
      
      if (githubUrl) {
        await extractGitHubInfo(githubUrl);
      }
      
      if (resumeFile || githubUrl) {
        setIsUploaded(true);
        // Persist parsed data using local variables to avoid state race
        try {
          const toSave: { resume_parsed?: unknown; github_parsed?: unknown } = {};
          if (parsedResume) toSave.resume_parsed = parsedResume;
          if (githubData) toSave.github_parsed = githubData;
          if (toSave.resume_parsed || toSave.github_parsed) {
            await saveParsedData(toSave);
          }
        } catch (e) {
          console.error('Saving parsed data failed:', e);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while processing your request.';
      
      // Provide more specific error messages for common issues
      let userFriendlyError = errorMessage;
      if (errorMessage.includes('educationAttendance.map is not a function')) {
        userFriendlyError = 'Error parsing education data from the PDF. The CV format may be different than expected.';
      } else if (errorMessage.includes('Candidate root missing')) {
        userFriendlyError = 'This PDF does not appear to be a Europass CV. Please upload a valid Europass PDF file.';
      } else if (errorMessage.includes('No attachments found')) {
        userFriendlyError = 'No XML data found in this PDF. Please ensure you are uploading a Europass CV with embedded XML data.';
      }
      
      setError(userFriendlyError);
      console.error('PDF Parsing Error:', err);
      
      // If it's a PDF worker error, reset the worker state
      if (errorMessage.includes('PDF') || errorMessage.includes('worker')) {
        setPdfWorkerReady(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpdate = () => {
    setIsUploaded(false);
    setResumeFile(null);
    setGithubUrl('');
    setParsedResume(null);
    setGithubData(null);
    setError(null);
  };

  const renderResumeData = () => {
    if (!parsedResume) return null;

    return (
      <div className="space-y-6">
        {/* Personal Information */}
        {parsedResume.personal && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-8 w-8 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parsedResume.personal.first_name && (
                <div>
                  <p className="text-sm font-medium text-blue-800">First Name</p>
                  <p className="text-blue-900">{parsedResume.personal.first_name}</p>
                </div>
              )}
              {parsedResume.personal.last_name && (
                <div>
                  <p className="text-sm font-medium text-blue-800">Last Name</p>
                  <p className="text-blue-900">{parsedResume.personal.last_name}</p>
                </div>
              )}
              {parsedResume.personal.email && (
                <div>
                  <p className="text-sm font-medium text-blue-800">Email</p>
                  <p className="text-blue-900">{parsedResume.personal.email}</p>
                </div>
              )}
              {parsedResume.personal.phone && (
                <div>
                  <p className="text-sm font-medium text-blue-800">Phone</p>
                  <p className="text-blue-900">{parsedResume.personal.phone}</p>
                </div>
              )}
              {parsedResume.personal.address && (
                <div>
                  <p className="text-sm font-medium text-blue-800">Address</p>
                  <p className="text-blue-900">{parsedResume.personal.address}</p>
                </div>
              )}
              {parsedResume.personal.dob && (
                <div>
                  <p className="text-sm font-medium text-blue-800">Date of Birth</p>
                  <p className="text-blue-900">{parsedResume.personal.dob}</p>
                </div>
              )}
              {parsedResume.personal.nationality && (
                <div>
                  <p className="text-sm font-medium text-blue-800">Nationality</p>
                  <p className="text-blue-900">{parsedResume.personal.nationality}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {parsedResume.education && parsedResume.education.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <GraduationCap className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-semibold text-green-900">Education</h3>
            </div>
            <div className="space-y-4">
              {parsedResume.education.map((edu, index) => (
                <div key={index} className="border-l-4 border-green-300 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-green-900">{edu.title}</h4>
                      <p className="text-green-700">{edu.organisation}</p>
                      {edu.city && <p className="text-green-600 text-sm">{edu.city}</p>}
                    </div>
                    <div className="text-right text-sm text-green-600">
                      {edu.start && <p>{edu.start}</p>}
                      {edu.end && <p>{edu.end}</p>}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-green-800 mt-2 text-sm">{edu.description}</p>
                  )}
                  {edu.level && (
                    <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded text-xs mt-2">
                      {edu.level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {parsedResume.experience && parsedResume.experience.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Briefcase className="h-8 w-8 text-purple-600" />
              <h3 className="text-lg font-semibold text-purple-900">Work Experience</h3>
            </div>
            <div className="space-y-4">
              {parsedResume.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-purple-300 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-purple-900">{exp.title}</h4>
                      <p className="text-purple-700">{exp.company}</p>
                      {exp.city && <p className="text-purple-600 text-sm">{exp.city}</p>}
                    </div>
                    <div className="text-right text-sm text-purple-600">
                      {exp.start && <p>{exp.start}</p>}
                      {exp.end && <p>{exp.end}</p>}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-purple-800 mt-2 text-sm whitespace-pre-line">{stripAndNormalizeHtml(exp.description)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {parsedResume.languages && parsedResume.languages.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Languages className="h-8 w-8 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-900">Languages</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parsedResume.languages.map((lang, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-yellow-200">
                  <h4 className="font-medium text-yellow-900 mb-2">{lang.code}</h4>
                  <div className="space-y-1 text-sm">
                    {lang.listening && (
                      <div className="flex justify-between">
                        <span className="text-yellow-700">Listening:</span>
                        <span className="text-yellow-900">{lang.listening}</span>
                      </div>
                    )}
                    {lang.reading && (
                      <div className="flex justify-between">
                        <span className="text-yellow-700">Reading:</span>
                        <span className="text-yellow-900">{lang.reading}</span>
                      </div>
                    )}
                    {lang.interaction && (
                      <div className="flex justify-between">
                        <span className="text-yellow-700">Interaction:</span>
                        <span className="text-yellow-900">{lang.interaction}</span>
                      </div>
                    )}
                    {lang.production && (
                      <div className="flex justify-between">
                        <span className="text-yellow-700">Production:</span>
                        <span className="text-yellow-900">{lang.production}</span>
                      </div>
                    )}
                    {lang.writing && (
                      <div className="flex justify-between">
                        <span className="text-yellow-700">Writing:</span>
                        <span className="text-yellow-900">{lang.writing}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
                {!pdfWorkerReady ? (
                  <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg text-sm">
                    Initializing PDF processor...
                  </div>
                ) : (
                  <>
                    <input 
                      type="file" 
                      id="resume-upload" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf"
                    />
                    <label htmlFor="resume-upload" className="mt-4 bg-primary-100 text-primary-700 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-primary-200 transition-colors">
                      Choose File
                    </label>
                  </>
                )}
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
                disabled={(!resumeFile && !githubUrl) || isLoading || !pdfWorkerReady}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : !pdfWorkerReady ? (
                  'Initializing...'
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

            {!parsedResume && !githubData ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No information extracted yet. Upload a Europass PDF or link your GitHub profile to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Resume Data */}
                {parsedResume && renderResumeData()}

                {/* GitHub Projects */}
                {githubData && (
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
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume; 