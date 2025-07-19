import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { MapPin, CheckCircle, ExternalLink } from 'lucide-react';

const internships = [
  {
    title: 'Software Engineering Intern',
    company: 'Google',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
    location: 'Mountain View, CA',
    match: 95,
    skills: ['C++', 'Java', 'Python'],
    description: 'Work on core Google products and services. This internship is a 12-14 week paid opportunity for students to get hands-on experience with real-world projects.',
  },
  {
    title: 'Frontend Engineer Intern',
    company: 'Meta',
    logo: 'https://blog.logomyway.com/wp-content/uploads/2021/11/meta-logo.png',
    location: 'Menlo Park, CA',
    match: 92,
    skills: ['React', 'JavaScript', 'GraphQL'],
    description: 'Join the team building the future of social technology. You will work on products like Facebook, Instagram, and WhatsApp.',
  },
  {
    title: 'Applied Scientist Intern',
    company: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    location: 'Seattle, WA',
    match: 88,
    skills: ['Machine Learning', 'Python', 'AWS'],
    description: 'Work on challenging problems in machine learning and artificial intelligence. This internship will give you experience with large-scale data.',
  },
  {
    title: 'Product Management Intern',
    company: 'Microsoft',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    location: 'Redmond, WA',
    match: 85,
    skills: ['Product Strategy', 'Data Analysis', 'UX'],
    description: 'Drive the vision and strategy for Microsoft products. You will work with engineers, designers, and marketers to launch new features.',
  },
];

const Internships = () => {
  const { isAuthenticated } = useAuth();
  const [selectedInternship, setSelectedInternship] = useState(internships[0]);
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set());

  const handleApply = (internshipTitle: string) => {
    setAppliedInternships(prev => new Set([...prev, internshipTitle]));
  };

  const isApplied = (internshipTitle: string) => {
    return appliedInternships.has(internshipTitle);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Internships</h1>
        <p className="text-gray-600 mb-8">Based on your profile and resume, here are the best matches for you.</p>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Internship List */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-4 space-y-3">
              {internships.map((internship) => (
                <div
                  key={internship.title}
                  onClick={() => setSelectedInternship(internship)}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${selectedInternship.title === internship.title ? 'bg-primary-50 shadow-md border border-primary-200' : 'hover:bg-gray-100'}`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <img src={internship.logo} alt={internship.company} className="h-8 w-auto" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{internship.title}</h3>
                      <p className="text-sm text-gray-600">{internship.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{internship.location}</span>
                    </div>
                    <span className="font-bold text-primary-600">{internship.match}% Match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internship Details */}
          <div className="w-full md:w-2/3">
            {selectedInternship && (
              <div className="bg-white rounded-xl shadow-lg p-8 sticky top-24">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{selectedInternship.title}</h2>
                        <p className="text-lg text-gray-600 font-medium">{selectedInternship.company}</p>
                        <div className="flex items-center space-x-2 text-gray-500 mt-1">
                            <MapPin className="h-4 w-4" />
                            <span>{selectedInternship.location}</span>
                        </div>
                    </div>
                    <img src={selectedInternship.logo} alt={selectedInternship.company} className="h-12 w-auto"/>
                </div>
                
                <div className="border-t border-gray-200 my-6"></div>

                <h3 className="font-semibold text-gray-800 mb-2">Job Description</h3>
                <p className="text-gray-600 mb-6">{selectedInternship.description}</p>
                
                <h3 className="font-semibold text-gray-800 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    {selectedInternship.skills.map(skill => (
                        <span key={skill} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">{skill}</span>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => handleApply(selectedInternship.title)}
                    disabled={isApplied(selectedInternship.title)}
                    className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                      isApplied(selectedInternship.title)
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    <CheckCircle className="h-5 w-5"/>
                    <span>{isApplied(selectedInternship.title) ? 'Applied' : 'Apply Now'}</span>
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