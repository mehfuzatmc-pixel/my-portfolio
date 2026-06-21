'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Unable to send your inquiry.');
      }

      setStatus('Thanks for reaching out. Your inquiry was saved successfully.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h2>Ready to turn your idea into a website?</h2>
        <p>
          Share your business, page idea, or reference style and I will help
          shape it into a clear website direction.
        </p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input
            name="name"
            onChange={handleChange}
            placeholder="Your name"
            required
            type="text"
            value={formData.name}
          />
        </label>
        <label>
          Email
          <input
            name="email"
            onChange={handleChange}
            placeholder="you@example.com"
            required
            type="email"
            value={formData.email}
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            onChange={handleChange}
            placeholder="Tell me about your project"
            required
            rows="5"
            value={formData.message}
          />
        </label>
        <button className="button primary" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Sending...' : 'Send Website Idea'}
        </button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </section>
  );
}

export default Contact;
