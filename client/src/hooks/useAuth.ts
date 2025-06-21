import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User, RegisterUser, LoginUser } from '@shared/schema';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Token management
const TOKEN_KEY = 'hkt_access_token';
const REFRESH_TOKEN_KEY = 'hkt_refresh_token';

export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// Add authorization header to requests
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function useAuth(): AuthState & {
  register: (data: RegisterUser) => Promise<void>;
  login: (data: LoginUser) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, confirmPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  connectWallet: (walletAddress: string) => Promise<void>;
  refreshToken: () => Promise<void>;
} {
  const queryClient = useQueryClient();

  // Get current user
  const { data: user, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) return null;

      try {
        const response = await apiRequest('GET', '/api/auth/me', undefined, getAuthHeaders());
        return await response.json();
      } catch (error: any) {
        if (error.message.includes('401') || error.message.includes('403')) {
          clearTokens();
          return null;
        }
        throw error;
      }
    },
    retry: false,
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterUser) => {
      const response = await apiRequest('POST', '/api/auth/register', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginUser) => {
      const response = await apiRequest('POST', '/api/auth/login', data);
      return response.json();
    },
    onSuccess: (data: AuthResponse) => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(['/api/auth/me'], data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      await apiRequest('POST', '/api/auth/logout', { refreshToken }, getAuthHeaders());
    },
    onSuccess: () => {
      clearTokens();
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.clear();
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest('POST', '/api/auth/forgot-password', { email });
      return response.json();
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password, confirmPassword }: { token: string; password: string; confirmPassword: string }) => {
      const response = await apiRequest('POST', '/api/auth/reset-password', { token, password, confirmPassword });
      return response.json();
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async ({ currentPassword, newPassword, confirmPassword }: { currentPassword: string; newPassword: string; confirmPassword: string }) => {
      const response = await apiRequest('POST', '/api/auth/change-password', { currentPassword, newPassword, confirmPassword }, getAuthHeaders());
      return response.json();
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await apiRequest('PUT', '/api/auth/profile', data, getAuthHeaders());
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/me'], data.user);
    },
  });

  // Connect wallet mutation
  const connectWalletMutation = useMutation({
    mutationFn: async (walletAddress: string) => {
      const response = await apiRequest('POST', '/api/auth/connect-wallet', { walletAddress }, getAuthHeaders());
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  // Refresh token mutation
  const refreshTokenMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token');

      const response = await apiRequest('POST', '/api/auth/refresh', { refreshToken });
      const data = await response.json();
      
      localStorage.setItem(TOKEN_KEY, data.accessToken);
      return data;
    },
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    register: async (data: RegisterUser) => {
      await registerMutation.mutateAsync(data);
    },
    login: async (data: LoginUser) => {
      await loginMutation.mutateAsync(data);
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    forgotPassword: async (email: string) => {
      await forgotPasswordMutation.mutateAsync(email);
    },
    resetPassword: async (token: string, password: string, confirmPassword: string) => {
      await resetPasswordMutation.mutateAsync({ token, password, confirmPassword });
    },
    changePassword: async (currentPassword: string, newPassword: string, confirmPassword: string) => {
      await changePasswordMutation.mutateAsync({ currentPassword, newPassword, confirmPassword });
    },
    updateProfile: async (data: Partial<User>) => {
      await updateProfileMutation.mutateAsync(data);
    },
    connectWallet: async (walletAddress: string) => {
      await connectWalletMutation.mutateAsync(walletAddress);
    },
    refreshToken: async () => {
      await refreshTokenMutation.mutateAsync();
    },
  };
}