// src/main.tsx
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from 'react-oidc-context';

const useCognito = import.meta.env.VITE_USE_COGNITO === "false";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_fEiOPUEJN",
  client_id: "5tt3j9a4rac2ckdgpl65jmlvgs",
  redirect_uri: window.location.origin,
  response_type: "code",
  scope: "email openid phone",
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
