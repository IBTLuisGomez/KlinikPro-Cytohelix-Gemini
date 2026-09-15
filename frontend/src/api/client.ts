const API_BASE_URL = 'http://localhost:8080';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const tenantId = localStorage.getItem('tenant_id');
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (tenantId) {
    headers.set('X-Tenant-ID', tenantId);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  if (response.status === 204) return null;
  return response.json();
}
