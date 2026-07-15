import axios from 'axios';
import { paystackConfig } from '@/lib/server/config/payment';
import { logger } from '@/lib/server/utils/logger';

export const paymentService = {
  initializePayment: async (email: string, amount: number, orderId: string) => {
    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
          email,
          amount: Math.round(amount * 100),
          callback_url: `${paystackConfig.callbackUrl}?order=${orderId}`,
          metadata: {
            order_id: orderId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${paystackConfig.secretKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.data;
    } catch (error) {
      logger.error('Error initializing payment:', error);
      throw new Error('Payment initialization failed');
    }
  },

  verifyPayment: async (reference: string) => {
    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${paystackConfig.secretKey}`,
          },
        }
      );

      return response.data.data;
    } catch (error) {
      logger.error('Error verifying payment:', error);
      throw new Error('Payment verification failed');
    }
  },
};
