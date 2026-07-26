export function saveToken(token: string) {
  localStorage.setItem('gevora_token', token);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gevora_token');
}

export function removeToken() {
  localStorage.removeItem('gevora_token');
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  try {
    const payload = token.split('.')[1];
    // atob handles base64url reasonably for typical JWT payloads
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  const token = getToken();
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) {
    // Malformed token — treat as logged out and clean up
    removeToken();
    return false;
  }

  const isExpired = Date.now() >= payload.exp * 1000;
  if (isExpired) {
    removeToken();
    return false;
  }

  return true;
}