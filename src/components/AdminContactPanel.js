'use client';

import { useState } from 'react';
import { apiRequest } from '../utils/api';

function formatDate(value) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function AdminContactPanel() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function signIn(event) {
    event.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const result = await apiRequest('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!result.user?.isAdmin) {
        setToken('');
        setUser(null);
        setContacts([]);
        setStatus('This account is not an admin account.');
        return;
      }

      setToken(result.token);
      setUser(result.user);
      setStatus('Signed in as admin.');
      await loadContacts(result.token);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadContacts(authToken = token) {
    if (!authToken) {
      setStatus('Sign in as admin first.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await apiRequest('/api/contacts', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setContacts(result.contacts);
      setStatus(`Loaded ${result.contacts.length} contact message${result.contacts.length === 1 ? '' : 's'}.`);
    } catch (error) {
      setContacts([]);
      setStatus(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function signOut() {
    setToken('');
    setUser(null);
    setContacts([]);
    setCredentials({ email: '', password: '' });
    setStatus('Signed out.');
  }

  return (
    <main className="admin-page">
      <section className="section admin-section">
        <a className="admin-back-link" href="/">
          Back to portfolio
        </a>

        <div className="section-heading">
          <p className="eyebrow">Private Admin</p>
          <h1>Contact messages</h1>
          <p>
            Sign in with your admin account to view messages submitted through
            the portfolio contact form.
          </p>
        </div>

        <div className="admin-shell">
          <div className="admin-toolbar">
            <div>
              <span>Admin Access</span>
              <strong>{user ? `${user.name} · Signed in` : 'Sign in required'}</strong>
            </div>
            {user && (
              <div className="admin-actions">
                <button className="button secondary" type="button" onClick={() => loadContacts()} disabled={isLoading}>
                  Refresh
                </button>
                <button className="button secondary" type="button" onClick={signOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {!user && (
            <form className="auth-form admin-login-form" onSubmit={signIn}>
              <label>
                Admin Email
                <input
                  name="email"
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  required
                  type="email"
                  value={credentials.email}
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  onChange={handleChange}
                  placeholder="Your admin password"
                  required
                  type="password"
                  value={credentials.password}
                />
              </label>
              <button className="button primary" disabled={isLoading} type="submit">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {status && <p className="form-status">{status}</p>}

          {contacts.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>IP Address</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.id}</td>
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.message}</td>
                      <td>{contact.ipAddress || 'Not captured'}</td>
                      <td>{formatDate(contact.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminContactPanel;
