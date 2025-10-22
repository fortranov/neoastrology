import { AuthToken, LoginCredentials, RegisterData, User } from '../types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

class AuthAPI {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async register(data: RegisterData): Promise<AuthToken> {
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthToken> {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    return response.json();
  }

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_URL}/api/v1/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch user');
    }

    return response.json();
  }
}

export const authAPI = new AuthAPI();
