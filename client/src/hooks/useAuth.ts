import { useQuery } from "@tanstack/react-query";
import type { User, UserProfile } from "@shared/schema";

interface AuthUser extends User {
  profile?: UserProfile;
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
  };
}
