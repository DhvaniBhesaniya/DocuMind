import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider.jsx";
import LandingPage from "@/pages/landing.jsx";
import Dashboard from "@/pages/dashboard.jsx";
import Profile from "@/pages/Profile.jsx";
import NotFound from "@/pages/not-found.jsx";
import AuthPage from "@/pages/auth.jsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/app" component={Dashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
