import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { MapPin, CheckCircle, ExternalLink } from 'lucide-react';

const internships = [
  {
    title: 'Frontend Developer Intern',
    company: 'Innovate Inc.',
    logo: 'https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg',
    location: 'Remote',
    match: 95,
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    description: 'Work on our next-generation user interfaces and build amazing features for our customers. You will be part of a dynamic team and contribute to a real product.',
  },
  {
    title: 'Full Stack Engineer Intern',
    company: 'Creative Solutions',
    logo: 'https://tailwindui.com/img/logos/statickit-logo-gray-900.svg',
    location: 'New York, NY',
    match: 92,
    skills: ['Node.js', 'React', 'GraphQL'],
    description: 'Join our full-stack team to develop and maintain our web applications. This is a great opportunity to learn about the entire development lifecycle.',
  },
  {
    title: 'Data Science Intern',
    company: 'Data Insights',
    logo: 'https://tailwindui.com/img/logos/mirage-logo-gray-900.svg',
    location: 'San Francisco, CA',
    match: 88,
    skills: ['Python', 'Pandas', 'scikit-learn'],
    description: 'Analyze large datasets to extract meaningful insights and help drive business decisions. You will work with experienced data scientists.',
  },
  {
    title: 'UX/UI Design Intern',
    company: 'Pixel Perfect',
    logo: 'https://tailwindui.com/img/logos/tuple-logo-gray-900.svg',
    location: 'Remote',
    match: 85,
    skills: ['Figma', 'Sketch', 'Adobe XD'],
    description: 'Design intuitive and beautiful user experiences for our mobile and web apps. Collaborate with product managers and engineers.',
  },
];

const Internships = () => {
  const { isAuthenticated } = useAuth();
  const [selectedInternship, setSelectedInternship] = useState(internships[0]);

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
                  <button className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
                    <CheckCircle className="h-5 w-5"/>
                    <span>Apply Now</span>
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