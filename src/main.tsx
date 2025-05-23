// src/main.tsx
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from 'react-oidc-context';
import { Buffer } from 'buffer';

// Polyfill Buffer globally at the earliest point
globalThis.Buffer = Buffer;

const isLocalhost = window.location.hostname === "localhost";
const isPreview = window.location.hostname === "preview--tweet-scheduler-nexus.lovable.app";
const isIdPreview = window.location.hostname === "id-preview--d4c3a08c-3f0c-4807-b234-fa087eec7556.lovable.app";
const isIframe = window.location.hostname === "lovable.dev";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_5rV1I5qC5", 
  client_id: "3irqdath7oj9ipbod5h410c5q3",
  redirect_uri: isLocalhost
    ? "http://localhost:8080/"
    : isPreview
    ? "https://preview--tweet-scheduler-nexus.lovable.app/"
    : isIdPreview
    ? "https://id-preview--d4c3a08c-3f0c-4807-b234-fa087eec7556.lovable.app/"
    : isIframe
    ? "https://lovable.dev/projects/d4c3a08c-3f0c-4807-b234-fa087eec7556"
    : "https://tweet-scheduler-nexus.lovable.app/",
  post_logout_redirect_uri: isLocalhost
    ? "http://localhost:8080/login"
    : isPreview
    ? "https://preview--tweet-scheduler-nexus.lovable.app/login"
    : isIdPreview
    ? "https://id-preview--d4c3a08c-3f0c-4807-b234-fa087eec7556.lovable.app/login"
    : isIframe
    ? "https://lovable.dev/projects/d4c3a08c-3f0c-4807-b234-fa087eec7556"
    : "https://tweet-scheduler-nexus.lovable.app/login",
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: true,
  loadUserInfo: true,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);