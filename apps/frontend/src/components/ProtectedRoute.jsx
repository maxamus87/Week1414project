import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingMessage from "./LoadingMessage.jsx";

export default function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();

  if (!ready) {
    return <LoadingMessage />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
