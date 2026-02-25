import HeroSection from './HeroSection';
import Technologies from './Technologies';
import FeaturedServices from './FeaturedServices';
import DevProcess from './DevProcess';
import Projects from './Projects';
import Testimonials from './Testimonials';
import FAQSection from './FAQSection';
import CTASection from './CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Technologies />
      <FeaturedServices />
      <DevProcess />
      <Projects />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </>
  );
}
