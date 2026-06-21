'use client';

import { useState } from 'react';
import { apiRequest } from '../utils/api';

function ConsultationFees() {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function startPayment() {
    setIsLoading(true);
    setStatus('');

    try {
      const result = await apiRequest('/api/payments/consultation-checkout', {
        method: 'POST',
      });

      if (!result.url) {
        throw new Error('Payment gateway did not return a checkout link.');
      }

      window.location.href = result.url;
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="section consultation" id="consultation">
      <div className="section-heading">
        <p className="eyebrow">Consultation Fees</p>
        <h2>Book a focused website planning session.</h2>
        <p>
          Start with a structured consultation before development. We will map
          your idea, pages, content, visual direction, and next steps.
        </p>
      </div>

      <div className="fee-panel">
        <div className="fee-content">
          <span>Website Consultation</span>
          <strong>$50</strong>
          <p>
            A one-on-one strategy session for clarifying your website goals,
            layout, content sections, and launch plan.
          </p>
          <ul>
            <li>Website goal and audience review</li>
            <li>Page structure and feature planning</li>
            <li>Design direction and next-step estimate</li>
          </ul>
        </div>

        <div className="payment-card">
          <span>Secure Checkout</span>
          <p>
            Payment is handled through Stripe Checkout after you add your Stripe
            secret key in the backend environment file.
          </p>
          <button className="button primary" type="button" onClick={startPayment} disabled={isLoading}>
            {isLoading ? 'Opening Checkout...' : 'Pay Consultation Fee'}
          </button>
          {status && <p className="form-status">{status}</p>}
        </div>
      </div>
    </section>
  );
}

export default ConsultationFees;
