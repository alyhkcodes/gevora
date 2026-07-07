'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveToken } from '@/lib/auth';

export default function OAuthSuccessPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      saveToken(token);
      router.push('/dashboard');
    } else {
      router.push('/login?error=oauth_failed');
    }
  }, [params, router]);

  return <p style={{ padding: 40, textAlign: 'center' }}>Signing you in...</p>;
}