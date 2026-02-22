import ContactSection from '../home/ContactSection';
import SectionHeader from '../../components/ui/SectionHeader';

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          tag="Contact Us"
          title="Let's Start a Conversation"
          description="Ready to take your Shopify store to the next level? Reach out to us."
        />
      </div>
      <ContactSection />
    </section>
  );
}
