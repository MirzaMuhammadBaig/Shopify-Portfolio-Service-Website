import { lazy, Suspense } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../shared/WhatsAppButton';

const ChatbotWidget = lazy(() => import('../shared/ChatbotWidget'));

export default function Layout({ children }) {
  return (
    <>
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
