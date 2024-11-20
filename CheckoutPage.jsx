// src/PaymentForm.js
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {useNavigate} from 'react-router-dom';
import './CheckoutPage.css';

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
  
    if (!stripe || !elements) {
      return;
    }
  
    const cardElement = elements.getElement(CardElement);
  
    try {
      // Create a payment intent on the backend
      const response = await fetch('http://localhost:5000/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 50 }), // Amount in cents (e.g., $50.00)
      });
  
      const { clientSecret } = await response.json();
  
      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
  
      if (stripeError) {
        setError(stripeError.message);
      } else {
        setSuccess(true);
        console.log('Payment successful');
        alert('Payment successful!');
      }
    } catch (error) {
      setError('Error creating payment: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
    <form onSubmit={handleSubmit} className="payment-form">
      <h2>Complete Your Payment</h2>
      <div className="card-element">
        <CardElement />
      </div>
      <button type="submit" disabled={!stripe || loading} className="submit-btn">
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
    <div className='payment-status'>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">Payment successful!
                {navigate('/Plans')}</p>}
    </div>
    </div>
  );
};

export default PaymentForm;
