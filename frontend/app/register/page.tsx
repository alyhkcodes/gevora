'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/api';
import { saveToken } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await registerUser({ email, password, name });
      saveToken(result.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#FAF7EE', padding: 24,
    }}>
      <form onSubmit={handleSubmit} style={{
        background: '#fff', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 16,
        padding: '32px 28px', width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 24, color: '#2C2820', marginBottom: 4 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 13, color: '#B8A88A', marginBottom: 8 }}>Join Gevora to manage your reviews</p>

        {error && (
          <div style={{ padding: '8px 12px', background: 'rgba(200,80,60,0.08)', border: '1px solid rgba(200,80,60,0.2)', borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: '#C0392B' }}>{error}</p>
          </div>
        )}

        <input
          type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(212,160,23,0.25)', fontSize: 13 }}
        />
        <input
          type="email" placeholder="Email" value={email} required
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(212,160,23,0.25)', fontSize: 13 }}
        />
        <input
          type="password" placeholder="Password (min 6 characters)" value={password} required
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(212,160,23,0.25)', fontSize: 13 }}
        />
        <button type="submit" disabled={loading}
          style={{ background: '#2C2820', color: '#FAF7EE', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}>
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <a href="/login" style={{ fontSize: 12, color: '#B8A88A', textAlign: 'center', marginTop: 6 }}>
          Already have an account? Log in
        </a>
      </form>
    </div>
  );
}