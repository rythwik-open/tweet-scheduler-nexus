import { useAuth } from "react-oidc-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Login from "./pages/login";
import Callback from "./pages/Callback";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { XAuthProvider } from "@/context/XAuthContext";

const queryClient = new QueryClient();

const App = () => {
  const auth = useAuth();

  const isLoading = auth?.isLoading ?? false;
  const isAuthenticated = auth?.isAuthenticated ?? false;

  // Debug logs for Cognito state
  console.log('App - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
  console.log('App - auth state:', auth);
  if (auth.error) {
    console.log('App - Cognito auth error:', auth.error);
  }

  // Cognito sign-out function
  const signOutRedirect = () => {
    const clientId = "3irqdath7oj9ipbod5h410c5q3";
    const cognitoDomain = "https://ap-south-15rv1i5qc5.auth.ap-south-1.amazoncognito.com";

    // Dynamically set the logout URI based on the environment
    const isLocalhost = window.location.hostname === "localhost";
    const isPreview = window.location.hostname === "preview--tweet-scheduler-nexus.lovable.app";
    const isIdPreview = window.location.hostname === "id-preview--d4c3a08c-3f0c-4807-b234-fa087eec7556.lovable.app";
    const isIframe = window.location.hostname === "lovable.dev";

    const logoutUri = isLocalhost
      ? "http://localhost:8080/login"
      : isPreview
      ? "https://preview--tweet-scheduler-nexus.lovable.app/login"
      : isIdPreview
      ? "https://id-preview--d4c3a08c-3f0c-4807-b234-fa087eec7556.lovable.app/login"
      : isIframe
      ? "https://lovable.dev/projects/d4c3a08c-3f0c-4807-b234-fa087eec7556"
      : "https://tweet-scheduler-nexus.lovable.app/login";

    const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;

    // Use the signOut function from react-oidc-context directly
    auth.removeUser().then(() => {
      window.location.href = logoutUrl; // Redirect to Cognito logout
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <XAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes - always accessible */}
              <Route path="/login" element={<Login />} />
              <Route path="/callback" element={<Callback />} />

              {/* Protected routes - only accessible if authenticated with Cognito */}
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <MainLayout onLogout={signOutRedirect}>
                      <Index />
                    </MainLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/schedule"
                element={
                  isAuthenticated ? (
                    <MainLayout onLogout={signOutRedirect}>
                      <Schedule />
                    </MainLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/history"
                element={
                  isAuthenticated ? (
                    <MainLayout onLogout={signOutRedirect}>
                      <History />
                    </MainLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/analytics"
                element={
                  isAuthenticated ? (
                    <MainLayout onLogout={signOutRedirect}>
                      <Analytics />
                    </MainLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
              <Route
                path="/settings"
                element={
                  isAuthenticated ? (
                    <MainLayout onLogout={signOutRedirect}>
                      <Settings />
                    </MainLayout>
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              {/* Catch-all route for unmatched paths */}
              <Route
                path="*"
                element={
                  isAuthenticated ? <NotFound /> : <Navigate to="/login" replace />
                }
              />
            </Routes>
          </BrowserRouter>
        </XAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;