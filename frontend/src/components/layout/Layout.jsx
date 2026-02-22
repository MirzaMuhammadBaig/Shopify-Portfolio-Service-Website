import Navbar from './Navbar';
import Footer from './Footer';
import ParticleBackground from '../animations/ParticleBackground';
import FloatingElements from '../animations/FloatingElements';
import WhatsAppButton from '../shared/WhatsAppButton';
import ChatbotWidget from '../shared/ChatbotWidget';

export default function Layout({ children }) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <ParticleBackground />
        <FloatingElements />
      </div>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <ChatbotWidget />
    </>
  );
}
