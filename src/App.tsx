import { useAuth } from "react-oidc-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Index from "./pages/Index";
import Schedule from "./pages/Schedule";
import History from "./pages/History";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "5tt3j9a4rac2ckdgpl65jmlvgs";
    const logoutUri = "http://localhost:8080";
    const cognitoDomain = "https://ap-south-1feiopuejn.auth.ap-south-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) return <div>Loading auth...</div>;
  if (auth.error) return <div>Error: {auth.error.message}</div>;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {auth.isAuthenticated ? (
          <>
            <button
              onClick={signOutRedirect}
              className="fixed top-4 right-4 z-50 bg-white/10 text-white px-4 py-2 rounded-xl"
            >
              Sign out
            </button>
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/schedule" element={<Schedule />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </MainLayout>
            </BrowserRouter>
          </>
        ) : (
          <div className="h-screen flex items-center justify-center text-white">
            <button
              onClick={() => auth.signinRedirect()}
              className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl"
            >
              Sign in with Cognito
            </button>
          </div>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
