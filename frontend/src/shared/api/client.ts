// shared/api/client.ts
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2904';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;

    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token');
    }

    if (token && !this.isTokenValid(token)) {
      this.handleTokenExpiration();
      throw new Error('Token expired');
    }

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401) {
          this.handleTokenExpiration();
          throw new Error('Unauthorized: Invalid or expired token');
        }
        if (response.status === 304) {
           return null;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      if (response.status === 204 || options.method === 'DELETE') {
        return null;
      }

      const contentLength = response.headers.get('Content-Length');
      const contentType = response.headers.get('Content-Type');

      if (contentLength === '0' || !contentType?.includes('application/json')) {
          if (contentLength === '0') {
              console.warn(`Response to ${options.method} ${url} was empty. Returning null.`);
              return null; 
          }
          if (contentType && !contentType.includes('application/json')) {
              console.warn(`Response to ${options.method} ${url} is not JSON. Returning text.`);
              return await response.text(); 
          }
      }

      return await response.json().catch(() => {
          console.error(`Failed to parse JSON response from ${options.method} ${url}`);
          throw new Error(`Invalid JSON response from ${options.method} ${url}`);
      });

    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return true;
    }
  }

  private handleTokenExpiration() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth';
    }
  }

  get(endpoint: string) {
    return this.request(endpoint);
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();