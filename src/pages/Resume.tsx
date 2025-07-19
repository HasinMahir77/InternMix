import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { UploadCloud, Github, BrainCircuit, Lightbulb, TrendingUp } from 'lucide-react';

const Resume = () => {
  const { isAuthenticated } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [extractedInfo] = useState({
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Next.js', 'GraphQL'],
    projects: [
      { name: 'InternMix Platform', description: 'A platform to connect students with internships.' },
      { name: 'E-commerce Website', description: 'A full-stack e-commerce solution.' },
    ],
    experience: [
      { title: 'Software Engineer Intern', company: 'Tech Corp', duration: 'Summer 2023' },
    ],
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Dummy upload logic
    if (resumeFile || githubUrl) {
      setIsUploaded(true);
    }
  };
  
  const handleUpdate = () => {
    setIsUploaded(false);
    setResumeFile(null);
    setGithubUrl('');
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
                <p className="text-sm text-gray-500 mt-1">PDF, DOC, DOCX (Max 5MB)</p>
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
              <button
                onClick={handleUpload}
                disabled={!resumeFile && !githubUrl}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Extract Information
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Skills */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <BrainCircuit className="h-8 w-8 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900">Top Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {extractedInfo.skills.map(skill => (
                    <span key={skill} className="bg-blue-200 text-blue-800 px-2.5 py-1 rounded-full text-sm font-medium">{skill}</span>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                 <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="h-8 w-8 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-900">Key Projects</h3>
                </div>
                <ul>
                  {extractedInfo.projects.map(project => (
                    <li key={project.name} className="mb-2">
                      <p className="font-semibold text-green-800">{project.name}</p>
                      <p className="text-sm text-green-700">{project.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Experience */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                 <div className="flex items-center space-x-3 mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-900">Experience</h3>
                </div>
                <ul>
                  {extractedInfo.experience.map(exp => (
                    <li key={exp.company} className="mb-2">
                      <p className="font-semibold text-purple-800">{exp.title}</p>
                      <p className="text-sm text-purple-700">{exp.company} - {exp.duration}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Resume; 