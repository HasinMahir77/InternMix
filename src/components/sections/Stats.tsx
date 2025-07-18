import { Users, Briefcase, Award, TrendingUp } from 'lucide-react';

const Stats = () => {
  const stats = [
    {
      id: 1,
      name: 'Active Students',
      value: '50,000+',
      icon: Users,
      description: 'Students from top universities',
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
    },
    {
      id: 2,
      name: 'Partner Companies',
      value: '2,500+',
      icon: Briefcase,
      description: 'From startups to Fortune 500',
      color: 'text-secondary-600',
      bgColor: 'bg-secondary-100',
    },
    {
      id: 3,
      name: 'Successful Matches',
      value: '25,000+',
      icon: Award,
      description: 'Internships completed successfully',
      color: 'text-success-600',
      bgColor: 'bg-success-100',
    },
    {
      id: 4,
      name: 'Success Rate',
      value: '94%',
      icon: TrendingUp,
      description: 'Students get full-time offers',
      color: 'text-accent-600',
      bgColor: 'bg-accent-100',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted by thousands of students and companies
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our platform has helped connect talented individuals with amazing opportunities across various industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all hover:shadow-lg group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-lg font-semibold text-gray-700">{stat.name}</div>
                  <div className="text-sm text-gray-500">{stat.description}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Stats Row */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-8 bg-gray-50 rounded-2xl px-8 py-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Universities</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">150+</div>
              <div className="text-sm text-gray-600">Cities</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">30+</div>
              <div className="text-sm text-gray-600">Industries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;