import { useState, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../shared/WhatsAppButton';
import Chatbot from '../shared/Chatbot';
import ScrollProgress from '../shared/ScrollProgress';
import PageLoader from '../ui/PageLoader';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function Layout() {
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
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
        <Footer />
        <Chatbot />
        <WhatsAppButton />
        <ScrollProgress />
      </div>
    </>
  );
}
