import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTA = () => {
  const benefits = [
    'Free to join and use',
    'Access to exclusive opportunities',
    'Personalized career guidance',
    'Direct recruiter connections',
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to launch your career?
            </h2>
            <p className="text-lg text-primary-100 mb-8">
              Join InternMix today and connect with top companies looking for talented students like you. 
              Your dream internship is just one click away.
            </p>

            {/* Benefits List */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success-400 flex-shrink-0" />
                  <span className="text-primary-50">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-all hover:shadow-lg group"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Image */}
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Successful professionals celebrating"
                className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
              />
              
              {/* Overlay Stats */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
              
              {/* Floating Achievement Cards */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg animate-bounce-subtle">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">2,500+</div>
                  <div className="text-xs text-gray-600">Companies</div>
                </div>
              </div>

              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg animate-bounce-subtle" style={{animationDelay: '1s'}}>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">94%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute -z-10 -top-4 -left-4 w-full h-full border-2 border-white/20 rounded-2xl"></div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-white">
            <div>
              <div className="text-2xl font-bold mb-1">50,000+</div>
              <div className="text-primary-200 text-sm">Active Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">25,000+</div>
              <div className="text-primary-200 text-sm">Successful Matches</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-1">500+</div>
              <div className="text-primary-200 text-sm">Universities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;