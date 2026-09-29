import { Navigate, Outlet, useLocation } from 'react-router-dom';

function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem('authToken');

  return token
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}

export default ProtectedRoute;
