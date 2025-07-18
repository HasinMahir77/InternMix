import { Search, UserCheck, MessageSquare, Trophy, Shield, Zap } from 'lucide-react';

const Features = () => {
  const features = [
    {
      id: 1,
      name: 'Smart Matching',
      description: 'Our AI-powered algorithm matches students with the perfect internship opportunities based on skills, interests, and career goals.',
      icon: Search,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      id: 2,
      name: 'Verified Companies',
      description: 'All partner companies are thoroughly vetted to ensure legitimate opportunities and safe working environments for students.',
      icon: Shield,
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      id: 3,
      name: 'Profile Building',
      description: 'Create compelling profiles that highlight your skills, projects, and achievements to stand out to potential employers.',
      icon: UserCheck,
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      id: 4,
      name: 'Direct Communication',
      description: 'Connect directly with hiring managers and team leads through our secure messaging platform.',
      icon: MessageSquare,
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
    },
    {
      id: 5,
      name: 'Success Tracking',
      description: 'Monitor your application progress, interview schedules, and career milestones all in one place.',
      icon: Trophy,
      color: 'text-warning-600',
      bgColor: 'bg-warning-100',
    },
    {
      id: 6,
      name: 'Instant Notifications',
      description: 'Get real-time alerts for new opportunities, application updates, and important deadlines.',
      icon: Zap,
      color: 'text-error-600',
      bgColor: 'bg-error-100',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to find your dream internship
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and resources you need to discover, apply for, 
            and secure meaningful internship opportunities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-lg group animate-slide-up"
                style={{ animationDelay: `${feature.id * 100}ms` }}
              >
                <div className={`${feature.bgColor} p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.name}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Join thousands of students who have already found their perfect internship match through InternMix.
            </p>
            <button className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Create Your Profile
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;