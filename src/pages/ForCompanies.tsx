import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, UserCheck, Briefcase, MessageSquare, ArrowRight } from 'lucide-react';

const ForCompanies = () => {
  const benefits = [
    {
      icon: Zap,
      title: 'Access Top Talent',
      description: 'Connect with a diverse pool of motivated students from leading universities, all in one place.',
    },
    {
      icon: UserCheck,
      title: 'AI-Powered Shortlisting',
      description: 'Our smart algorithm helps you find the best-fit candidates by matching skills and requirements.',
    },
    {
      icon: Briefcase,
      title: 'Streamline Hiring',
      description: 'Manage your entire internship pipeline, from posting jobs to making offers, on a single platform.',
    },
    {
      icon: MessageSquare,
      title: 'Build Your Brand',
      description: 'Showcase your company culture and opportunities to attract the next generation of talent.',
    },
  ];

  const steps = [
    {
      id: 1,
      title: 'Create a Company Profile',
      description: 'Sign up and tell students what makes your company a great place to work.',
    },
    {
      id: 2,
      title: 'Post Internships',
      description: 'List your open roles with detailed descriptions and requirements in minutes.',
    },
    {
      id: 3,
      title: 'Find & Connect',
      description: 'Review applications, shortlist candidates, and engage with them directly.',
    },
    {
      id: 4,
      title: 'Hire the Best',
      description: 'Make offers to top candidates and build your future workforce.',
    },
  ];

  const testimonials = [
    {
        name: 'John Davis',
        role: 'Head of Talent at Stripe',
        content: 'InternMix has become our go-to platform for sourcing high-quality intern candidates. The process is efficient and effective.',
        image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
    {
        name: 'Linda Harris',
        role: 'University Relations at Adobe',
        content: "We've hired some of our best talent through InternMix. The platform makes it easy to connect with students who are passionate and skilled.",
        image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
    },
  ];

  return (
    <div className="pt-16 bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Find Your Next Great Hire</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Access a diverse talent pool of skilled students and streamline your internship recruiting process.
          </p>
          <Link
            to="/signup"
            state={{ userType: 'company' }}
            className="inline-flex items-center justify-center px-8 py-4 bg-secondary-600 text-white font-semibold rounded-xl hover:bg-secondary-700 transition-all"
          >
            Post a Job for Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900">Why Companies Love InternMix</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {benefits.map((benefit, index) => (
                      <div key={index} className="bg-gray-50 p-6 rounded-2xl text-center">
                          <div className="bg-white p-4 rounded-xl w-fit mx-auto mb-4">
                              <benefit.icon className="h-8 w-8 text-secondary-600" />
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
              <h2 className="text-3xl font-bold text-gray-900 mb-12">Hiring in Four Simple Steps</h2>
              <div className="relative">
                  <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -translate-y-1/2"></div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                      {steps.map((step, index) => (
                          <div key={index} className="flex flex-col items-center">
                              <div className="bg-secondary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">{step.id}</div>
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
                  <h2 className="text-3xl font-bold text-gray-900">Trusted by Leading Companies</h2>
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
      <section className="py-20 bg-secondary-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Build Your Future Workforce?</h2>
              <p className="text-secondary-100 text-lg mb-8">
                  Post your internship roles today and connect with the best emerging talent.
              </p>
              <Link
                  to="/signup"
                  state={{ userType: 'company' }}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-secondary-600 font-semibold rounded-xl hover:bg-gray-100"
              >
                  Start Hiring Now
              </Link>
          </div>
      </section>
    </div>
  );
};

export default ForCompanies; 