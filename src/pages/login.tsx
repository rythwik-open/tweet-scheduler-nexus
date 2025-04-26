import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/"); // Redirect to dashboard if already authenticated
    } else {
      setLoading(false); // Stop loading once authentication check is done
    }
  }, [auth.isAuthenticated, navigate]);

  const handleLogin = () => {
    auth.signinRedirect().catch((err) => {
      console.error("Login error:", err);
      // Optionally show an error message to the user
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <span>Loading...</span> {/* Optional loading spinner */}
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center text-white">
      <button
        onClick={handleLogin}
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl"
      >
        Sign in with Cognito
      </button>
    </div>
  );
};

export default Login;
