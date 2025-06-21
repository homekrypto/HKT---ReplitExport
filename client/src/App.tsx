import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/contexts/AppContext";
import AuthGuard from "@/components/auth-guard";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import AIAssistant from "@/components/ai-assistant";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import Home from "@/pages/home";
import HowItWorks from "@/pages/how-it-works";
import BuyHKT from "@/pages/buy-hkt";
import Dashboard from "@/pages/dashboard";
import OurMission from "@/pages/our-mission";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Profile from "@/pages/profile";
import EmailVerified from "@/pages/email-verified-simple";
import TermsAndConditions from "@/pages/terms-and-conditions";
import PrivacyPolicy from "@/pages/privacy-policy";
import Whitepaper from "@/pages/whitepaper";
import FAQ from "@/pages/faq";
import WorkWithUs from "@/pages/work-with-us";
import Contact from "@/pages/contact";
import ForDevelopers from "@/pages/for-developers";
import RegisterAsAgent from "@/pages/register-as-agent";
import InvestmentGrowthProjection from "@/pages/investment-growth-projection";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/our-mission" component={OurMission} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={ResetPassword} />
      <Route path="/verify-email" component={EmailVerified} />
      <Route path="/buy-hkt" component={BuyHKT} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/terms-and-conditions" component={TermsAndConditions} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/homekrypto-whitepaper" component={Whitepaper} />
      <Route path="/whitepaper" component={Whitepaper} />
      <Route path="/frequently-asked-questions" component={FAQ} />
      <Route path="/faq" component={FAQ} />
      <Route path="/work-with-us" component={WorkWithUs} />
      <Route path="/contact" component={Contact} />
      <Route path="/for-developers" component={ForDevelopers} />
      <Route path="/register-as-agent" component={RegisterAsAgent} />
      <Route path="/investment-growth-projection" component={InvestmentGrowthProjection} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const aiAssistant = useAIAssistant();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <AuthGuard>
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <Navigation />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <AIAssistant 
              isOpen={aiAssistant.isOpen}
              onToggle={aiAssistant.toggle}
              currentPage={aiAssistant.currentPage}
            />
            <Toaster />
          </AuthGuard>
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
}

export default App;
