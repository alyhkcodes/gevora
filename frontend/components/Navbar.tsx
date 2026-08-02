'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api';
import { saveToken } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      saveToken(result.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7EE', padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212,160,23,0.2)', borderRadius: 16, padding: '32px 28px', width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h1 style={{ fontFamily: 'var(--font-playfair), serif', fontSize: 24, color: '#2C2820', marginBottom: 4 }}>Welcome back</h1>
        <p style={{ fontSize: 13, color: '#B8A88A', marginBottom: 8 }}>Log in to your Gevora account</p>

        {error && (
          <div style={{ padding: '8px 12px', background: 'rgba(200,80,60,0.08)', border: '1px solid rgba(200,80,60,0.2)', borderRadius: 8 }}>
            <p style={{ fontSize: 12, color: '#C0392B' }}>{error}</p>
          </div>
        )}

        <input type="email" placeholder="Email" value={email} required onChange={(e) => setEmail(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.9)', background: 'rgba(250,247,238,0.7)', color: '#2C2820', fontSize: 13 }} />
        <input type="password" placeholder="Password" value={password} required onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.9)', background: 'rgba(250,247,238,0.7)', color: '#2C2820', fontSize: 13 }} />

        <button type="submit" disabled={loading} style={{ background: '#2C2820', color: '#FAF7EE', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 6 }}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(212,160,23,0.2)' }} />
          <span style={{ fontSize: 11, color: '#B8A88A' }}>OR</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(212,160,23,0.2)' }} />
        </div>

        <a href={`${API_BASE}/auth/google`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(255,255,255,0.85)', color: '#2C2820', border: '1px solid rgba(212,160,23,0.25)', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
          Sign in with Google
        </a>

        <a href="/register" style={{ fontSize: 12, color: '#B8A88A', textAlign: 'center', marginTop: 6 }}>
          Don&apos;t have an account? Register
        </a>
      </form>
    </div>
  );
}