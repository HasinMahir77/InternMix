import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Software Engineering Intern',
      company: 'Google',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: "InternMix completely transformed my job search. The platform's matching algorithm connected me with Google, and I'm now working on cutting-edge AI projects. The support team was incredible throughout the entire process.",
      rating: 5,
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      role: 'Marketing Intern',
      company: 'Spotify',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: "The quality of companies on InternMix is outstanding. I found my dream internship at Spotify within just two weeks of joining. The direct messaging feature made connecting with recruiters so much easier.",
      rating: 5,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'UX Design Intern',
      company: 'Airbnb',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: "As a design student, I was worried about finding the right opportunity. InternMix's profile builder helped me showcase my portfolio effectively, and I landed an amazing UX internship at Airbnb!",
      rating: 5,
    },
    {
      id: 4,
      name: 'Alex Thompson',
      role: 'Data Science Intern',
      company: 'Netflix',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: "InternMix didn't just help me find an internship; it helped me find my career path. The mentorship and resources available through the platform are invaluable. Highly recommend to any student!",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Success stories from our students
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from students who found their dream internships and launched successful careers through InternMix.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all animate-slide-up group"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="h-8 w-8 text-primary-600 opacity-50" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at <span className="font-medium">{testimonial.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">94%</div>
              <div className="text-gray-600">Student Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Average Platform Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success-600 mb-2">87%</div>
              <div className="text-gray-600">Get Full-time Offers</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Join thousands of successful students
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Start your journey today and become our next success story.
          </p>
          <button className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl">
            Start Your Success Story
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;