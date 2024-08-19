'use server';

import { Flight, PaymentData } from '@/lib/types';
import crypto from 'crypto-js';

const API_URL = 'http://localhost:8080/api';

type BookingData = {
  paymentData: PaymentData;
  flightData: Flight[];
  totalPrice: string;
};

const encryptData = (data: string) => {
  const secretKey = 'mock_secret_key';
  return crypto.AES.encrypt(data, secretKey).toString();
};

//TODO: Add types for Promise
export async function createPaymentIntentAndBooking({
  paymentData,
  flightData,
  totalPrice,
}: BookingData): Promise<any> {
  const encryptedCardNumber = encryptData(paymentData.cardNumber);
  const encryptedExpiryDate = encryptData(paymentData.expiryDate);
  const encryptedSecurityCode = encryptData(paymentData.securityCode);

  try {
    const paymentResponse = await fetch(
      `${API_URL}/payments/create-payment-intent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bankName: paymentData.bankName,
          nameOnAccount: paymentData.nameOnAccount,
          cardNumber: encryptedCardNumber,
          expiryDate: encryptedExpiryDate,
          securityCode: encryptedSecurityCode,
          totalPrice,
          currency: 'usd',
        }),
      }
    );

    const paymentResponseData = await paymentResponse.json();

    if (
      paymentResponse.ok &&
      paymentResponseData.status === 'payment_succeeded'
    ) {
      // Payment successful, now create a booking
      const bookingResponse = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullname: paymentData.fullname,
          email: paymentData.email,
          totalPrice,
          paid: true,
          flightData,
        }),
      });

      if (bookingResponse.ok) {
        return bookingResponse;
      } else {
        return { status: 'error', message: 'Booking response error' };
      }
    } else {
      return { status: 'error', message: 'Payment confirmation error' };
    }
  } catch (error) {
    console.error('Error booking flight:', error);
    return error;
  }
}
