import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, UserCheck, Briefcase, MessageSquare, ArrowRight } from 'lucide-react';

const ForStudents = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Our smart algorithm connects you with internships that perfectly align with your skills, interests, and career ambitions.',
    },
    {
      icon: UserCheck,
      title: 'Build a Standout Profile',
      description: 'Create a professional profile that showcases your projects, achievements, and resume to impress top employers.',
    },
    {
      icon: Briefcase,
      title: 'Exclusive Opportunities',
      description: 'Gain access to thousands of verified internships from innovative startups to Fortune 500 companies.',
    },
    {
      icon: MessageSquare,
      title: 'Direct Recruiter Access',
      description: 'Communicate directly with hiring managers through our seamless messaging platform to get your questions answered.',
    },
  ];

  const steps = [
    {
      id: 1,
      title: 'Sign Up Free',
      description: 'Create your profile in minutes.',
    },
    {
      id: 2,
      title: 'Get Matched',
      description: 'Discover relevant opportunities.',
    },
    {
      id: 3,
      title: 'Apply & Connect',
      description: 'Submit applications and talk to recruiters.',
    },
    {
      id: 4,
      title: 'Get Hired',
      description: 'Land your dream internship.',
    },
  ];

  const testimonials = [
    {
      name: 'Jessica Miller',
      role: 'Software Engineering Intern at Google',
      content: 'InternMix made my internship search so much easier. I found the perfect role that matched my skills and passions.',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
      name: 'David Wilson',
      role: 'Product Design Intern at Microsoft',
      content: 'The portfolio feature helped me stand out. I received three offers and accepted my dream role at Microsoft.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    }
  ];

  return (
    <div className="pt-16 bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Your Career Starts Here</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find and apply for your dream internship with the world's leading companies.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all"
          >
            Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Students Choose InternMix</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl text-center">
                <div className="bg-white p-4 rounded-xl w-fit mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Four Easy Steps to Success</h2>
          <div className="relative">
             <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                      <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">{step.id}</div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900">Don't Just Take Our Word for It</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                          <p className="text-gray-700 text-lg mb-6">"{testimonial.content}"</p>
                          <div className="flex items-center">
                              <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                              <div>
                                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Dream Internship?</h2>
          <p className="text-primary-100 text-lg mb-8">
            Join over 50,000 students who are already on their way to career success.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100"
          >
            Sign Up Now and Get Matched
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ForStudents; 