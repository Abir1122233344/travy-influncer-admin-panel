import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// DEVELOPMENT MODE: Set to true to disable route protection
const DISABLE_AUTH = true;

// Simple JWT decode (for client-side role extraction)
function decodeToken(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Get user role from token or localStorage
function getUserRole() {
  if (typeof window === "undefined") return null;
  
  try {
    const token = localStorage.getItem("travy_token");
    if (!token) return null;
    
    const decoded = decodeToken(token);
    if (decoded?.role) return decoded.role;
    
    // Fallback: check if we stored role separately
    const storedRole = localStorage.getItem("travy_user_role");
    if (storedRole) return storedRole;
    
    return null;
  } catch {
    return null;
  }
}

// Check if user is authenticated
function isAuthenticated() {
  if (typeof window === "undefined") return false;
  
  try {
    const token = localStorage.getItem("travy_token");
    if (!token) return false;
    
    // Basic token validation (not expired)
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("travy_token");
      localStorage.removeItem("travy_user_role");
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

export function withAuth(WrappedComponent, requiredRole = null) {
  return function AuthenticatedComponent(props) {
    // DEVELOPMENT MODE: Skip all auth checks and render component directly
    if (DISABLE_AUTH) {
      return <WrappedComponent {...props} />;
    }

    // PRODUCTION MODE: Original authentication logic
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      let isCancelled = false;

      async function checkAuth() {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          if (!isCancelled) {
            router.replace("/auth/login");
          }
          return;
        }

        // If no specific role required, just check authentication
        if (!requiredRole) {
          if (!isCancelled) {
            setIsAuthorized(true);
            setIsLoading(false);
          }
          return;
        }

        // Check if user has the required role
        const userRole = getUserRole();
        if (userRole !== requiredRole) {
          if (!isCancelled) {
            router.replace("/auth/login");
          }
          return;
        }

        if (!isCancelled) {
          setIsAuthorized(true);
          setIsLoading(false);
        }
      }

      checkAuth();

      return () => {
        isCancelled = true;
      };
    }, [router]);

    // Show loading state while checking authentication
    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
            <p className="text-sm text-gray-600">Checking authentication...</p>
          </div>
        </div>
      );
    }

    // If authorized, render the wrapped component
    if (isAuthorized) {
      return <WrappedComponent {...props} />;
    }

    // This should not be reached, but just in case
    return null;
  };
}

// Utility function to store user data after login
export function storeUserData(token, role = null) {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem("travy_token", token);
    if (role) {
      localStorage.setItem("travy_user_role", role);
    }
  } catch (err) {
    console.error("Failed to store user data:", err);
  }
}

// Utility function to clear user data on logout
export function clearUserData() {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem("travy_token");
    localStorage.removeItem("travy_user_role");
  } catch (err) {
    console.error("Failed to clear user data:", err);
  }
}

// Hook for components that need auth info
export function useAuth() {
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      const role = getUserRole();
      
      setIsAuthenticated(authenticated);
      setUserRole(role);
    };

    checkAuth();
    
    // Listen for storage changes (e.g., when token is updated)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return { isAuthenticated, userRole };
}
