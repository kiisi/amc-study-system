import type { User } from "shared/schema";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private state: AuthState = {
    user: null,
    token: "",
    // token: localStorage.getItem('auth-token'),
    isAuthenticated: false,
  };

  private listeners: Array<(state: AuthState) => void> = [];

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const token = this.state.token;
    if (token) {
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const user = await response.json();
          this.setState({
            user,
            token,
            isAuthenticated: true,
          });
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState() {
    return this.state;
  }

  async login(email: string, password: string) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const { user, token } = await response.json();
    localStorage.setItem('auth-token', token);
    
    this.setState({
      user,
      token,
      isAuthenticated: true,
    });

    return { user, token };
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isAdmin?: boolean;
  }) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const { user, token } = await response.json();
    localStorage.setItem('auth-token', token);
    
    this.setState({
      user,
      token,
      isAuthenticated: true,
    });

    return { user, token };
  }

  logout() {
    localStorage.removeItem('auth-token');
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  }

  getAuthHeaders(): Record<string, string> {
    return this.state.token 
      ? { 'Authorization': `Bearer ${this.state.token}` }
      : {};
  }
}

export const authManager = new AuthManager();
