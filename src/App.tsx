import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Disclaimer from "@/pages/disclaimer";

const queryClient = new QueryClient();

function normalizeRouterPath() {
  const params = new URLSearchParams(window.location.search);
  const redirectPath = params.get("p") ?? window.location.pathname;

  if (!redirectPath || redirectPath === "/") {
    return;
  }

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalizedBasePath = basePath === "" ? "" : `/${basePath.replace(/^\/+|\/+$/g, "")}`;
  const normalizedPath = redirectPath.replace(/^\/+/, "");
  const routePath = normalizedBasePath && normalizedPath.startsWith(normalizedBasePath.replace(/^\/+/, ""))
    ? `/${normalizedPath.slice(normalizedBasePath.replace(/^\/+/, "").length).replace(/^\/+/, "") || ""}`
    : `/${normalizedPath}`;
  const safeRoutePath = routePath === "/" ? "/" : routePath;
  const baseUrl = `${window.location.origin}${normalizedBasePath || "/"}`;
  const targetUrl = new URL(safeRoutePath, baseUrl);

  window.history.replaceState({}, "", `${targetUrl.pathname}${targetUrl.search}${targetUrl.hash}`);
}

normalizeRouterPath();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
