import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import Upload from "./pages/Upload";
import Quiz from "./pages/Quiz";
import AdminDashboard from "./pages/AdminDashboard";

function Router() {
  const [, setLocation] = useLocation();

  // لو المستخدم فتح الموقع على / والموقع جاب صفحة بيضاء، هينقله فوراً لصفحة اللوجين
  useEffect(() => {
    if (window.location.pathname === "/") {
      setLocation("/login");
    }
  }, [setLocation]);

  return (
    <Switch>
      <Route path={"/"} component={Login} /> {/* تم التوجيه للوجين مباشرة لتفادي كراش الهوم */}
      <Route path={"/login"} component={Login} />
      <Route path={"/dashboard"} component={StudentDashboard} />
      <Route path={"/upload"} component={Upload} />
      <Route path={"/quiz"} component={Quiz} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
