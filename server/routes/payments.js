const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { z } = require('zod');

const decryptData = (data) => {
  const secretKey = 'mock_secret_key_for_demo';
  const iv = Buffer.from(data.iv, 'hex');
  const encryptedText = Buffer.from(data.encryptedData, 'hex');
  const decipher = crypto.createDecipheriv(
    'aes-192-cbc',
    Buffer.from(secretKey),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const paymentSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required'),
  nameOnAccount: z.string().min(1, 'Name on account is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryDate: z
    .string()
    .regex(/^\d{2}\/\d{4}$/, 'Expiry date must be in MM/YYYY format'),
  securityCode: z.string().regex(/^\d{3}$/, 'Security code must be 3 digits'),
  totalPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Total price must be a valid amount'),
  currency: z.enum(['usd', 'eur', 'gbp']).default('usd'),
});

router.post('/create-payment-intent', (req, res) => {
  const {
    bankName,
    nameOnAccount,
    cardNumber,
    expiryDate,
    securityCode,
    totalPrice,
    currency,
  } = req.body;

  const decryptedCardNumber = decryptData(cardNumber);
  const decryptedExpiryDate = decryptData(expiryDate);
  const decryptedSecurityCode = decryptData(securityCode);

  const dataToBeValidated = {
    bankName,
    nameOnAccount,
    cardNumber: decryptedCardNumber,
    expiryDate: decryptedExpiryDate,
    securityCode: decryptedSecurityCode,
    totalPrice,
    currency,
  };

  const validationResult = paymentSchema.safeParse(dataToBeValidated);
  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }

  logger.info(`Payment Successed for ${totalPrice}`);

  res.json({
    status: 'payment_succeeded',
    clientSecret: 'mock_client_secret',
  });
});

module.exports = router;
