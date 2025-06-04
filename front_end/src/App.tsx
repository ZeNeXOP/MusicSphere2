import { useState } from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import {
  BrowserRouter as Router,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@contexts/AuthContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Create a wrapper component to handle conditional rendering
const AppContent = () => {
  const location = useLocation();
  const { user, isLoading, isAuthenticated } = useAuth();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // Only render AppRoutes. Each page is responsible for its own layout (AppShell)
  return <AppRoutes />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlayerProvider>
          <Router>
            <AppContent />
          </Router>
        </PlayerProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
