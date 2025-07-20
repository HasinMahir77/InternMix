import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Briefcase, Building, MapPin, Clock } from 'lucide-react';

const internships = [
  {
    title: 'Software Engineering Intern',
    company: 'Google',
    logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png',
    location: 'Mountain View, CA',
    status: 'Applied',
    date: '2023-10-15',
  },
  {
    title: 'Frontend Engineer Intern',
    company: 'Meta',
    logo: 'https://blog.logomyway.com/wp-content/uploads/2021/11/meta-logo.png',
    location: 'Menlo Park, CA',
    status: 'Under Review',
    date: '2023-10-12',
  },
  {
    title: 'Applied Scientist Intern',
    company: 'Amazon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    location: 'Seattle, WA',
    status: 'Interview Scheduled',
    date: '2023-10-10',
  },
];


const Applications = () => {
  const { isAuthenticated, appliedInternships } = useAuth();
  
  const appliedFor = internships.filter(internship => appliedInternships.has(internship.title));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Applications</h1>

        {appliedFor.length > 0 ? (
          <div className="space-y-6">
            {appliedFor.map((app) => (
              <div key={app.title} className="bg-white rounded-xl shadow-md p-6 flex items-start space-x-6">
                <img src={app.logo} alt={app.company} className="h-12 w-12 object-contain" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{app.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <div className="flex items-center space-x-1">
                              <Building className="h-4 w-4" />
                              <span>{app.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{app.location}</span>
                          </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        app.status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                        app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>{app.status}</span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                        <Clock className="h-3 w-3" />
                        <span>Applied on {app.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white rounded-xl shadow-md p-12">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No Applications Yet</h2>
            <p className="mt-2 text-gray-600">You haven't applied for any internships yet. Start exploring opportunities!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications; 