import HeroSection from './HeroSection';
import FeaturedServices from './FeaturedServices';
import DevProcess from './DevProcess';
import Projects from './Projects';
import Technologies from './Technologies';
import Testimonials from './Testimonials';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedServices />
      <DevProcess />
      <Projects />
      <Technologies />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  );
}
