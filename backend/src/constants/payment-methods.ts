export const PAYMENT_METHODS = {
  STRIPE: 'STRIPE',
  PAYONEER: 'PAYONEER',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export const MANUAL_PAYMENT_METHODS = [
  PAYMENT_METHODS.PAYONEER,
] as const;
