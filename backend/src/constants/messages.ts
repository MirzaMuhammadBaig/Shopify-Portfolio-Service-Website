export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  UNAUTHORIZED: 'Authentication required',
  FORBIDDEN: 'Insufficient permissions',
  TOKEN_EXPIRED: 'Token has expired',
  TOKEN_INVALID: 'Invalid token',
  REFRESH_SUCCESS: 'Token refreshed successfully',
} as const;

export const USER_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  USER_NOT_FOUND: 'User not found',
  USERS_FETCHED: 'Users fetched successfully',
  USER_DELETED: 'User deleted successfully',
} as const;

export const SERVICE_MESSAGES = {
  CREATED: 'Service created successfully',
  UPDATED: 'Service updated successfully',
  DELETED: 'Service deleted successfully',
  NOT_FOUND: 'Service not found',
  FETCHED: 'Services fetched successfully',
} as const;

export const ORDER_MESSAGES = {
  CREATED: 'Order placed successfully',
  UPDATED: 'Order updated successfully',
  NOT_FOUND: 'Order not found',
  FETCHED: 'Orders fetched successfully',
  STATUS_UPDATED: 'Order status updated successfully',
} as const;

export const CHAT_MESSAGES = {
  CONVERSATION_CREATED: 'Conversation created successfully',
  MESSAGE_SENT: 'Message sent successfully',
  FETCHED: 'Messages fetched successfully',
  CONVERSATION_NOT_FOUND: 'Conversation not found',
} as const;

export const REVIEW_MESSAGES = {
  CREATED: 'Review submitted successfully',
  UPDATED: 'Review updated successfully',
  DELETED: 'Review deleted successfully',
  NOT_FOUND: 'Review not found',
  FETCHED: 'Reviews fetched successfully',
  ALREADY_REVIEWED: 'You have already reviewed this service',
} as const;

export const BLOG_MESSAGES = {
  CREATED: 'Blog post created successfully',
  UPDATED: 'Blog post updated successfully',
  DELETED: 'Blog post deleted successfully',
  NOT_FOUND: 'Blog post not found',
  FETCHED: 'Blog posts fetched successfully',
} as const;

export const GENERAL_MESSAGES = {
  SERVER_ERROR: 'Internal server error',
  VALIDATION_ERROR: 'Validation error',
  NOT_FOUND: 'Resource not found',
  SUCCESS: 'Operation successful',
} as const;
