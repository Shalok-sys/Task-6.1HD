// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const speakeasy = require('speakeasy');
const mailgun = require('mailgun-js');

const stripe = Stripe('')
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body; // Amount in cents

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd', // Specify your currency
      payment_method_types: ['card'],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

let secret; // Store secret globally

// Generate secret and return otpauth_url
app.post('/api/generate-2fa', (req, res) => {
  secret = speakeasy.generateSecret({ name: 'DevDeakin' });
  res.json({ otpauth_url: secret.otpauth_url });
});

// Verify token
app.post('/api/verify-2fa', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  const verified = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token,
    window: 1, // Allow some drift
  });

  if (verified) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Set up Mailgun API
const mg = mailgun({ apiKey: '', domain: '' });

// Function to send a welcome email
const sendWelcomeEmail = (email) => {
    return new Promise((resolve, reject) => {
        const data = {
            from: 'Dev@Deakin.com',
            to: email,
            subject: 'Welcome to DEV@Deakin!',
            text: `Hi from DEV@Deakin! What would you like to develop today.`,
        };

        mg.messages().send(data, (error, body) => {
            if (error) {
                console.error('Error sending welcome email:', error);
                reject(error);
            } else {
                console.log('Welcome email sent:', body);
                resolve(body);
            }
        });
    });
};


// Endpoint to handle new subscriber
app.post('/subscribe', (req, res) => {
    const { email } = req.body;

    sendWelcomeEmail(email)
        .then(() => {
            res.status(200).json({ message: 'Subscription successful and welcome email sent.' });
        })
        .catch((error) => {
            res.status(500).json({ message: 'Subscription failed', error });
        });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
