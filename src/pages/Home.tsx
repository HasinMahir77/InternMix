import Hero from '../components/sections/Hero';
import Features from '../components/sections/Features';
import HowItWorks from '../components/sections/HowItWorks';
import Testimonials from '../components/sections/Testimonials';
import Stats from '../components/sections/Stats';
import CTA from '../components/sections/CTA';

const Home = () => {
  return (
    <div className="pt-16">
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </div>
  );
};

export default Home;