import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROLES } from './constants';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/shared/ScrollToTop';
import PageLoader from './components/ui/PageLoader';

// Lazy-loaded pages — each becomes its own chunk
const HomePage = lazy(() => import('./pages/home/HomePage'));
const ServicesPage = lazy(() => import('./pages/services/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/services/ServiceDetailPage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const VerifyEmailPage = lazy(() => import('./pages/auth/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));
const GuestRoute = lazy(() => import('./components/shared/GuestRoute'));
const BlogPage = lazy(() => import('./pages/blog/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/blog/BlogDetailPage'));
const AboutPage = lazy(() => import('./pages/about/AboutPage'));
const CertificatesPage = lazy(() => import('./pages/certificates/CertificatesPage'));
const ContactPage = lazy(() => import('./pages/contact/ContactPage'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('./pages/payment/PaymentSuccessPage'));

// Dashboard (rarely visited by most users)
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const ProtectedRoute = lazy(() => import('./components/shared/ProtectedRoute'));
const DashboardOrders = lazy(() => import('./pages/dashboard/DashboardOrders'));
const DashboardProfile = lazy(() => import('./pages/dashboard/DashboardProfile'));
const OrderDetailPage = lazy(() => import('./pages/dashboard/OrderDetailPage'));

// Admin (only admin users)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'));

const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminFaqs = lazy(() => import('./pages/admin/AdminFaqs'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'));

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Suspense fallback={<PageLoader showProgress={false} />}>
      <Routes>
        {/* Public routes — Layout mounts once, pages swap via Outlet */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/payment/success/:orderId" element={<PaymentSuccessPage />} />
          <Route path="/checkout/:orderId" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        </Route>

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardProfile />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="orders/:id" element={<OrderDetailPage />} />
        </Route>

        {/* Admin Panel */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[ROLES.ADMIN]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />

          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="faqs" element={<AdminFaqs />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="about" element={<AdminAbout />} />
        </Route>
      </Routes>
    </Suspense>
    </>
  );
}
