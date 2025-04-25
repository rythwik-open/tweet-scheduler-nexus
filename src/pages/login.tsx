// src/pages/Login.tsx
import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/"); // Redirect to dashboard
    }
  }, [auth.isAuthenticated, navigate]);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      <button
        onClick={() => auth.signinRedirect()}
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl"
      >
        Sign in with Cognito
      </button>
    </div>
  );
};

export default Login;
