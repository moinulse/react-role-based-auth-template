import { getUser, login, logout } from '@/api/auth';
import { User } from "@/types/user";
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type AuthState = {
  authToken: string | null;
  currentUser: User | null;
};

type AuthContext = AuthState & {
  isLoading: boolean;
  isError: boolean;
  handleLogin: (username: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();

  const {
    data: authState,
    isLoading,
    isError,
  } = useQuery<AuthState>({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const storedToken = localStorage.getItem("authToken");
        if (!storedToken) {
          return { authToken: null, currentUser: null };
        }

        const user = await getUser();
        if (user) {
          return { authToken: storedToken, currentUser: user };
        } else {
          localStorage.removeItem("authToken");
          return { authToken: null, currentUser: null };
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        return { authToken: null, currentUser: null };
      }
    },
    staleTime: 1000 * 60 * 60 * 8,
    gcTime: 1000 * 60 * 60 * 10,
  });

  const loginMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => login(username, password),
    onSuccess: (data) => {
      if (data.success && data.authToken && data.user) {
        localStorage.setItem("authToken", data.authToken);
        queryClient.setQueryData<AuthState>(["auth"], {
          authToken: data.authToken,
          currentUser: data.user,
        });
      } else {
        throw new Error(data.message || "Login failed");
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      localStorage.removeItem("authToken");
      queryClient.setQueryData<AuthState>(["auth"], {
        authToken: null,
        currentUser: null,
      });
    },
  });


  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("authToken");
      queryClient.setQueryData<AuthState>(["auth"], {
        authToken: null,
        currentUser: null,
      });
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });

  const handleLogin = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  useEffect(() => {
    const prefetchUser = async () => {
      await queryClient.prefetchQuery({
        queryKey: ["auth"],
        queryFn: async () => {
          try {
            const storedToken = localStorage.getItem("authToken");
            if (!storedToken) {
              return { authToken: null, currentUser: null };
            }

            const user = await getUser();
            if (user) {
              return { authToken: storedToken, currentUser: user };
            } else {
              localStorage.removeItem("authToken");
              return { authToken: null, currentUser: null };
            }
          } catch (error) {
            console.error("Failed to fetch user:", error);
            return { authToken: null, currentUser: null };
          }
        },
        staleTime: 1000 * 60 * 60 * 8,
        gcTime: 1000 * 60 * 60 * 10,
      });
    };
    void prefetchUser();
  }, [queryClient]);

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