// lib/api/client.ts
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2904';
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Безопасный доступ к localStorage
    let token: string | null = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('access_token');
    }

    // Validate token before using it
    if (token && !this.isTokenValid(token)) {
      // Token might be expired, try to refresh or redirect to login
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
          // Unauthorized - token might be invalid or expired
          this.handleTokenExpiration();
          throw new Error('Unauthorized: Invalid or expired token');
        }
        if (response.status === 304) {
           // 304 означает, что данные не изменились.
           // Возвращаем null, SWR оставит предыдущие данные.
           return null;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // For DELETE requests there might be no body
      if (response.status === 204 || options.method === 'DELETE') {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Helper method to validate token (you might need to adjust this based on your token format)
  private isTokenValid(token: string): boolean {
    try {
      // If using JWT, you can decode and check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      // If not JWT or parsing fails, assume token is valid
      return true;
    }
  }

  // Handle token expiration (redirect to login, clear storage, etc.)
  private handleTokenExpiration() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // Redirect to login page
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