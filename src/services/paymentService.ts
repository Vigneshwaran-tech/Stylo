// Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

if (!RAZORPAY_KEY_ID) {
  throw new Error('Missing env var: VITE_RAZORPAY_KEY_ID');
}

// Declare Razorpay type
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number; // in rupees
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

export const initiatePayment = (options: PaymentOptions): Promise<PaymentResult> => {
  return new Promise((resolve) => {
    // Convert rupees to paise (Razorpay uses paise)
    const amountInPaise = Math.round(options.amount * 100);

    const razorpayOptions = {
      key: RAZORPAY_KEY_ID,
      amount: amountInPaise,
      currency: 'INR',
      name: 'Stylo - Barber Booking',
      description: options.description,
      image: '/vite.svg',
      prefill: {
        name: options.prefill?.name || '',
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || '',
      },
      theme: {
        color: '#f8b646',
      },
      handler: function (response: any) {
        // Payment successful
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
        });
      },
      modal: {
        ondismiss: function () {
          // User closed the payment modal
          resolve({
            success: false,
            error: 'Payment cancelled by user',
          });
        },
      },
    };

    try {
      const razorpay = new window.Razorpay(razorpayOptions);
      razorpay.open();
    } catch (error: any) {
      resolve({
        success: false,
        error: error.message || 'Payment initialization failed',
      });
    }
  });
};

// Test card details for testing:
// Card Number: 4111 1111 1111 1111
// CVV: Any 3 digits
// Expiry: Any future date
