import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../shared/WhatsAppButton';
import ScrollProgress from '../shared/ScrollProgress';

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollProgress />
    </>
  );
}
