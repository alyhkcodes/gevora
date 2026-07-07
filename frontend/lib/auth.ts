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

export function isLoggedIn(): boolean {
  return !!getToken();
}