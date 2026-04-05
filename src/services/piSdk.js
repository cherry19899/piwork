/**
 * Pi SDK Service
 * Initializes and manages Pi Network authentication and payments
 */

// Check if Pi is available in the browser
const getPi = () => {
  if (typeof window !== 'undefined' && (window as any).Pi) {
    return (window as any).Pi;
  }
  return null;
};

// Initialize Pi SDK
export const initPiSdk = async () => {
  const Pi = getPi();
  
  if (!Pi) {
    console.error('[Pi SDK] Pi not available. Open in Pi Browser or Pi App.');
    throw new Error('Pi SDK not available');
  }

  try {
    // Check browser environment
    if (!Pi.browserEnvironment) {
      console.warn('[Pi SDK] Not in Pi Browser environment');
    }

    // Initialize based on environment
    const config = {
      version: '2.0',
      sandbox: process.env.NODE_ENV === 'development',
    };

    await Pi.init(config);
    console.log('[Pi SDK] Initialized successfully');
    return Pi;
  } catch (error) {
    console.error('[Pi SDK] Initialization failed:', error);
    throw error;
  }
};

/**
 * Authenticate user with Pi Network
 */
export const authenticate = async () => {
  try {
    const Pi = getPi();
    if (!Pi) {
      throw new Error('Pi SDK not initialized');
    }

    const scopes = ['payments', 'wallet_address'];
    const response = await Pi.authenticate(scopes, onIncompletePaymentFound);
    
    console.log('[Pi SDK] User authenticated:', response);
    return response;
  } catch (error) {
    console.error('[Pi SDK] Authentication failed:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 */
export const getUser = async () => {
  try {
    const Pi = getPi();
    if (!Pi) {
      throw new Error('Pi SDK not initialized');
    }

    const user = await Pi.me();
    console.log('[Pi SDK] User info retrieved:', user);
    return user;
  } catch (error) {
    console.error('[Pi SDK] Get user failed:', error);
    throw error;
  }
};

/**
 * Create a payment
 */
export const createPayment = async (paymentData: {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
}) => {
  try {
    const Pi = getPi();
    if (!Pi) {
      throw new Error('Pi SDK not initialized');
    }

    const payment = await Pi.createPayment({
      amount: paymentData.amount,
      memo: paymentData.memo,
      metadata: paymentData.metadata || {},
    });

    console.log('[Pi SDK] Payment created:', payment);
    return payment;
  } catch (error) {
    console.error('[Pi SDK] Payment creation failed:', error);
    throw error;
  }
};

/**
 * Complete a payment
 */
export const completePayment = async (paymentId: string, txid: string) => {
  try {
    const Pi = getPi();
    if (!Pi) {
      throw new Error('Pi SDK not initialized');
    }

    const payment = await Pi.completePayment(paymentId, txid);
    console.log('[Pi SDK] Payment completed:', payment);
    return payment;
  } catch (error) {
    console.error('[Pi SDK] Payment completion failed:', error);
    throw error;
  }
};

/**
 * Handle incomplete payments (for wallet closing, page refresh, etc.)
 */
const onIncompletePaymentFound = async (payment: any) => {
  console.log('[Pi SDK] Incomplete payment found:', payment);
  // Handle recovery - user can retry or cancel
  return payment;
};

/**
 * Sign a message (for additional security)
 */
export const signMessage = async (message: string) => {
  try {
    const Pi = getPi();
    if (!Pi || !Pi.signMessage) {
      throw new Error('Sign message not available');
    }

    const signature = await Pi.signMessage(message);
    console.log('[Pi SDK] Message signed');
    return signature;
  } catch (error) {
    console.error('[Pi SDK] Sign message failed:', error);
    throw error;
  }
};

export default {
  initPiSdk,
  authenticate,
  getUser,
  createPayment,
  completePayment,
  signMessage,
};
