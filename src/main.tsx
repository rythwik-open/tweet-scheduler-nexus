// src/main.tsx
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from 'react-oidc-context';

const useCognito = import.meta.env.VITE_USE_COGNITO === "true";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_E84n71jRx",
  client_id: "j5vv1k04i83joltpak6848u57",
  redirect_uri: "http://localhost:8080/",
  response_type: "code",
  scope: "openid email profile", // profile gives you "name" etc.
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
