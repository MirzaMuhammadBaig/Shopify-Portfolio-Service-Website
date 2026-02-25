import { lazy, Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingElements from '../animations/FloatingElements';
import WhatsAppButton from '../shared/WhatsAppButton';

// Heavy components — lazy load so they don't block initial render
const ParticleBackground = lazy(() => import('../animations/ParticleBackground'));
const ChatbotWidget = lazy(() => import('../shared/ChatbotWidget'));

export default function Layout({ children }) {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Suspense fallback={null}>
          <ParticleBackground />
        </Suspense>
        <FloatingElements />
      </div>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <Suspense fallback={null}>
        <ChatbotWidget />
      </Suspense>
    </>
  );
}
