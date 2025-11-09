import { Navigate } from 'react-router';
import { authService } from '../services/auth.service';
import role from '../constants/role.constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: number[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const user = authService.getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.accountRole)) {
    // Redirect to appropriate dashboard based on role
    if (user.accountRole === role.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/staff/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
