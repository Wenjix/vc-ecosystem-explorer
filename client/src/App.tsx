import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// Support GitHub Pages subdirectory deployment:
// In production, VITE_BASE_PATH is set to "/vc-ecosystem-explorer/"
// In dev, it defaults to "/"
const basePath = (import.meta.env.VITE_BASE_PATH || "/").replace(/\/$/, "") || "/";

function AppRouter() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <WouterRouter base={basePath === "/" ? undefined : basePath}>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </WouterRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
