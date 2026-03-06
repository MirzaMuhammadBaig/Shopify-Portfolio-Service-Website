import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../shared/WhatsAppButton';
import Chatbot from '../shared/Chatbot';
import ScrollProgress from '../shared/ScrollProgress';
import PageLoader from '../ui/PageLoader';

export default function Layout({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Wait for fonts + next paint so the full UI is rendered before revealing
    document.fonts.ready.then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setReady(true);
        });
      });
    });
  }, []);

  return (
    <>
      {!ready && <PageLoader />}
      <div style={{
        opacity: ready ? 1 : 0,
        visibility: ready ? 'visible' : 'hidden',
        transition: 'opacity 0.3s ease',
      }}>
        <Navbar />
        <main style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </main>
        <Footer />
        <Chatbot />
        <WhatsAppButton />
        <ScrollProgress />
      </div>
    </>
  );
}
