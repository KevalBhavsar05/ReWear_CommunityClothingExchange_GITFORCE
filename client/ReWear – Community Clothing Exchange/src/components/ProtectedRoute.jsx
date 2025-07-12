import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { ClipLoader } from "react-spinners";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, userData, loading } = useAppContext();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader size={50} color="#3B82F6" />
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required but user is not admin, redirect to home
  if (requireAdmin && !userData?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute; 