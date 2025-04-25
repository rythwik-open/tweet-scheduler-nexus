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
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => {
  const auth = useAuth();

  const isLoading = auth?.isLoading ?? false;
  const isAuthenticated = auth?.isAuthenticated ?? false;

  // Cognito sign-out function
  const signOutRedirect = () => {
    const clientId = "j5vv1k04i83joltpak6848u57";
    const logoutUri = "http://localhost:8080/login"; // Your desired post-logout redirect
    const cognitoDomain = "https://ap-south-1e84n71jrx.auth.ap-south-1.amazoncognito.com";

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
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public login route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            {isAuthenticated ? (
              <>
                <Route
                  path="/"
                  element={<MainLayout onLogout={signOutRedirect}><Index /></MainLayout>}
                />
                <Route
                  path="/schedule"
                  element={<MainLayout onLogout={signOutRedirect}><Schedule /></MainLayout>}
                />
                <Route
                  path="/history"
                  element={<MainLayout onLogout={signOutRedirect}><History /></MainLayout>}
                />
                <Route
                  path="/analytics"
                  element={<MainLayout onLogout={signOutRedirect}><Analytics /></MainLayout>}
                />
                <Route
                  path="/settings"
                  element={<MainLayout onLogout={signOutRedirect}><Settings /></MainLayout>}
                />
                <Route path="*" element={<NotFound />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" replace />} />
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
