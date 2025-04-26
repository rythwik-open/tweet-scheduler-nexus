// src/main.tsx
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from 'react-oidc-context';

const useCognito = import.meta.env.VITE_USE_COGNITO === "false";

// ✅ Correct authority — your hosted UI domain, not the IdP endpoint
const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_5rV1I5qC5", 
  client_id: "3irqdath7oj9ipbod5h410c5q3",
  redirect_uri: "http://localhost:8080/",
  post_logout_redirect_uri: "http://localhost:8080/login", // ✅ Add this
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  loadUserInfo: true,
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    {useCognito ? (
      <AuthProvider {...cognitoAuthConfig}>
        <App />
      </AuthProvider>
    ) : (
      <App />
    )}
  </React.StrictMode>
);
