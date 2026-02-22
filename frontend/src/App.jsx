import { Routes, Route } from 'react-router-dom';
import { ROLES } from './constants';
import Layout from './components/layout/Layout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
import HomePage from './pages/home/HomePage';
import ServicesPage from './pages/services/ServicesPage';
import ServiceDetailPage from './pages/services/ServiceDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import BlogPage from './pages/blog/BlogPage';
import BlogDetailPage from './pages/blog/BlogDetailPage';
import ContactPage from './pages/contact/ContactPage';

// Dashboard Pages
import DashboardOverview from './pages/dashboard/DashboardOverview';
import DashboardOrders from './pages/dashboard/DashboardOrders';
import DashboardChat from './pages/dashboard/DashboardChat';
import DashboardReviews from './pages/dashboard/DashboardReviews';
import DashboardProfile from './pages/dashboard/DashboardProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminServices from './pages/admin/AdminServices';
import AdminOrders from './pages/admin/AdminOrders';
import AdminChat from './pages/admin/AdminChat';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminReviews from './pages/admin/AdminReviews';

export default function App() {
  return (
    <Routes>
      {/* Public routes with main layout */}
      <Route element={<Layout><HomePage /></Layout>} path="/" />
      <Route element={<Layout><ServicesPage /></Layout>} path="/services" />
      <Route element={<Layout><ServiceDetailPage /></Layout>} path="/services/:slug" />
      <Route element={<Layout><BlogPage /></Layout>} path="/blog" />
      <Route element={<Layout><BlogDetailPage /></Layout>} path="/blog/:slug" />
      <Route element={<Layout><ContactPage /></Layout>} path="/contact" />
      <Route element={<Layout><LoginPage /></Layout>} path="/login" />
      <Route element={<Layout><RegisterPage /></Layout>} path="/register" />
      <Route element={<Layout><VerifyEmailPage /></Layout>} path="/verify-email" />

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
        <Route path="orders" element={<AdminOrders />} />
        <Route path="chat" element={<AdminChat />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>
    </Routes>
  );
}
