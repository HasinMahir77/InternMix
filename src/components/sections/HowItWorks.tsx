import { UserPlus, Search, MessageSquare, Briefcase } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: 'Create Your Profile',
      description: 'Sign up and build a comprehensive profile showcasing your skills, experience, and career aspirations.',
      icon: UserPlus,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      id: 2,
      title: 'Discover Opportunities',
      description: 'Browse through thousands of internship opportunities from top companies across various industries.',
      icon: Search,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      id: 3,
      title: 'Connect & Apply',
      description: 'Apply to positions that match your interests and connect directly with hiring managers.',
      icon: MessageSquare,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
    },
    {
      id: 4,
      title: 'Start Your Journey',
      description: 'Get hired and begin your professional journey with support from our career development team.',
      icon: Briefcase,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started with InternMix is simple. Follow these four easy steps to find and secure your ideal internship.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.id} className="relative animate-slide-up" style={{ animationDelay: `${index * 200}ms` }}>
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -translate-x-4 z-0"></div>
                )}
                
                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative">
                      <div className={`${step.bgColor} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                        <Icon className={`h-8 w-8 ${step.color}`} />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-gray-900 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                        {step.id}
                      </div>
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Visual Timeline for Mobile */}
        <div className="lg:hidden mt-12">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative flex items-start mb-8 last:mb-0">
                  <div className={`${step.bgColor} p-2 rounded-lg mr-4 relative z-10`}>
                    <Icon className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to take the first step?
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join InternMix today and start your journey towards finding the perfect internship opportunity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
              Get Started Free
            </button>
            <button className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-gray-400 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;