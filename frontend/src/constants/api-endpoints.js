export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VERIFY_EMAIL: '/auth/verify-email',
    CONTACT: '/auth/contact',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    PROFILE: '/users/profile',
  },
  SERVICES: {
    BASE: '/services',
    FEATURED: '/services/featured',
    BY_SLUG: (slug) => `/services/${slug}`,
    BY_ID: (id) => `/services/${id}`,
  },
  ORDERS: {
    BASE: '/orders',
    MY: '/orders/my',
    BY_ID: (id) => `/orders/${id}`,
    STATUS: (id) => `/orders/${id}/status`,
  },
  CHAT: {
    CONVERSATIONS: '/chat/conversations',
    CONVERSATION: (id) => `/chat/conversations/${id}`,
    MESSAGES: (id) => `/chat/conversations/${id}/messages`,
    MARK_READ: (id) => `/chat/conversations/${id}/read`,
    UNREAD: '/chat/unread',
  },
  REVIEWS: {
    BASE: '/reviews',
    BY_SERVICE: (serviceId) => `/reviews/service/${serviceId}`,
    BY_ID: (id) => `/reviews/${id}`,
  },
  BLOGS: {
    BASE: '/blogs',
    BY_SLUG: (slug) => `/blogs/${slug}`,
    BY_ID: (id) => `/blogs/${id}`,
  },
  PROJECTS: {
    BASE: '/projects',
    FEATURED: '/projects/featured',
    BY_SLUG: (slug) => `/projects/${slug}`,
    BY_ID: (id) => `/projects/${id}`,
  },
  FAQS: {
    BASE: '/faqs',
    BY_ID: (id) => `/faqs/${id}`,
  },
  TESTIMONIALS: {
    BASE: '/testimonials',
    BY_ID: (id) => `/testimonials/${id}`,
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
  },
};
