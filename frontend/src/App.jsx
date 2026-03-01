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
const ContactPage = lazy(() => import('./pages/contact/ContactPage'));
const CheckoutPage = lazy(() => import('./pages/checkout/CheckoutPage'));
const PaymentSuccessPage = lazy(() => import('./pages/payment/PaymentSuccessPage'));

// Dashboard (rarely visited by most users)
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));
const ProtectedRoute = lazy(() => import('./components/shared/ProtectedRoute'));
const DashboardOverview = lazy(() => import('./pages/dashboard/DashboardOverview'));
const DashboardOrders = lazy(() => import('./pages/dashboard/DashboardOrders'));
const DashboardChat = lazy(() => import('./pages/dashboard/DashboardChat'));
const DashboardReviews = lazy(() => import('./pages/dashboard/DashboardReviews'));
const DashboardProfile = lazy(() => import('./pages/dashboard/DashboardProfile'));

// Admin (only admin users)
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminChat = lazy(() => import('./pages/admin/AdminChat'));
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminFaqs = lazy(() => import('./pages/admin/AdminFaqs'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));

export default function App() {
  return (
    <>
    <ScrollToTop />
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes with main layout */}
        <Route element={<Layout><HomePage /></Layout>} path="/" />
        <Route element={<Layout><ServicesPage /></Layout>} path="/services" />
        <Route element={<Layout><ServiceDetailPage /></Layout>} path="/services/:slug" />
        <Route element={<Layout><BlogPage /></Layout>} path="/blog" />
        <Route element={<Layout><BlogDetailPage /></Layout>} path="/blog/:slug" />
        <Route element={<Layout><ContactPage /></Layout>} path="/contact" />
        <Route element={<Layout><GuestRoute><LoginPage /></GuestRoute></Layout>} path="/login" />
        <Route element={<Layout><GuestRoute><RegisterPage /></GuestRoute></Layout>} path="/register" />
        <Route element={<Layout><VerifyEmailPage /></Layout>} path="/verify-email" />
        <Route element={<Layout><GuestRoute><ForgotPasswordPage /></GuestRoute></Layout>} path="/forgot-password" />
        <Route element={<Layout><ResetPasswordPage /></Layout>} path="/reset-password" />

        {/* Payment */}
        <Route element={<Layout><PaymentSuccessPage /></Layout>} path="/payment/success/:orderId" />
        <Route element={<ProtectedRoute><Layout><CheckoutPage /></Layout></ProtectedRoute>} path="/checkout/:orderId" />

        {/* User Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="orders" element={<DashboardOrders />} />
          <Route path="chat" element={<DashboardChat />} />
          <Route path="reviews" element={<DashboardReviews />} />
          <Route path="profile" element={<DashboardProfile />} />
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
          <Route path="chat" element={<AdminChat />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="faqs" element={<AdminFaqs />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="payments" element={<AdminPayments />} />
        </Route>
      </Routes>
    </Suspense>
    </>
  );
}
