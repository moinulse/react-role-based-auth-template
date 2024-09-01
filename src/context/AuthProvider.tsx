import { getUser, login, logout } from '@/api/auth';
import { RoleType, User } from "@/types/user";
import { createContext, PropsWithChildren, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type AuthState = {
  authToken: string | null;
  currentUser: User | null;
};

type AuthContext = AuthState & {
  isLoading: boolean;
  isError: boolean;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const { data: authState, isLoading, isError } = useQuery<AuthState>({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const response = await getUser();
        const { authToken, user } = response;
        return { authToken, currentUser: user };
      } catch (error) {
        console.error('Failed to fetch user:', error);
        return { authToken: null, currentUser: null };
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const { authToken, user } = data[1];
      queryClient.setQueryData<AuthState>(['auth'], { authToken, currentUser: user });
    },
    onError: (error) => {
      console.error('Login failed:', error);
      queryClient.setQueryData<AuthState>(['auth'], { authToken: null, currentUser: null });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData<AuthState>(['auth'], { authToken: null, currentUser: null });
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  const handleLogin = async () => {
    await loginMutation.mutateAsync();
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  const contextValue: AuthContext = {
    authToken: authState?.authToken ?? null,
    currentUser: authState?.currentUser ?? null,
    isLoading,
    isError,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used inside of an AuthProvider');
  }
  return context;
}