import { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';
import { RoleType, User } from "@/types/user";

type ProtectedRouteProps = PropsWithChildren<{
  allowedRoles?: RoleType[];
}>;

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const { currentUser, isLoading, isError } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: Unable to authenticate</div>;
  }

  if (!currentUser) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to unauthorized page if user doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}