import React from 'react';
import { Users, Target, Heart, Award, ArrowRight } from 'lucide-react';
import profilePic from '../dummy-assets/Student/dp.jpg';

const About = () => {
  const values = [
    {
      icon: Target,
      title: 'Mission-Driven',
      description: 'We believe in connecting talent with opportunity to create meaningful career experiences.',
    },
    {
      icon: Heart,
      title: 'Student-Focused',
      description: 'Every decision we make prioritizes the success and growth of our student community.',
    },
    {
      icon: Users,
      title: 'Inclusive Platform',
      description: 'Building bridges between diverse backgrounds and creating equal opportunities for all.',
    },
    {
      icon: Award,
      title: 'Excellence First',
      description: 'We maintain high standards to ensure quality matches and successful outcomes.',
    },
  ];

  const team = [
    {
      name: 'Hasin Mahir',
      role: 'CEO & Co-Founder',
      image: profilePic,
      description: 'Former Head of Talent at Google, passionate about connecting students with opportunities.',
    },
    {
      name: 'Hasan Mahmud',
      role: 'CTO & Co-Founder',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Tech veteran with 15+ years building scalable platforms at Microsoft and Amazon.',
    },
    {
      name: 'Muymuna Rahman',
      role: 'Head of Student Success',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Former university career counselor dedicated to student career development.',
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">InternMix</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're on a mission to democratize access to meaningful internship opportunities by connecting 
              talented students with innovative companies around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  InternMix was born from a simple observation: too many talented students struggle to find 
                  meaningful internship opportunities, while innovative companies miss out on fresh perspectives 
                  and emerging talent.
                </p>
                <p>
                  Founded in 2025 by a Hasin Mahir, a Computer Science Student at Independent University, Bangladesh(IUB),
                  we set out to bridge this gap with technology, transparency, and a genuine commitment 
                  to student success.
                </p>
                <p>
                  Today, we're proud to have helped over 25,000 students launch their careers through 
                  meaningful internship experiences with 2,500+ partner companies worldwide.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Team collaboration"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="bg-primary-100 p-4 rounded-xl w-fit mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Passionate professionals dedicated to connecting talent with opportunity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Impact</h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">
              Numbers that reflect our commitment to student success and company growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-primary-100">Students Served</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">2,500+</div>
              <div className="text-primary-100">Partner Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">25,000+</div>
              <div className="text-primary-100">Successful Matches</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">94%</div>
              <div className="text-primary-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to join our mission?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're a student looking for opportunities or a company seeking fresh talent, 
            we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all hover:shadow-lg group">
              Get Started Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 transition-all">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;