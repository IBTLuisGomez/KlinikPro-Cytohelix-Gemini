// Frontend API Client Configuration
const API_BASE_URL = 'http://localhost:8080/fhir';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // En lugar de enviar un X-Tenant-ID inseguro,
  // obtenemos el JWT que nos firmó el backend al hacer login.
  const token = localStorage.getItem('klinikpro_jwt');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expirado o inválido: forzar re-login
      localStorage.removeItem('klinikpro_jwt');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  // FHIR puede responder vacio en DELETE
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

const REST_BASE_URL = 'http://localhost:8080/api';

export async function fetchRestApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('klinikpro_jwt');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${REST_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('klinikpro_jwt');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}
