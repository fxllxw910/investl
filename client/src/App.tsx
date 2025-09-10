import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import HomePage from "@/pages/home-page";
import ProfilePage from "@/pages/profile-page";
import ContractsPage from "@/pages/contracts-page";
import ActsPage from "@/pages/acts-page";
import InvoicesPage from "@/pages/invoices-page";
import PaymentSchedulePage from "@/pages/payment-schedule-page";
import OtherDocumentsPage from "@/pages/other-documents-page";
import ChangePasswordPage from "@/pages/change-password-page";
import MainPage from "@/pages/main-page";
import ContactsPage from "@/pages/contacts-page";
import AboutPage from "@/pages/about-page";
import PartnersPage from './pages/partners';
import FAQPage from "@/pages/faq-page";
import SpectechnikaPage from "@/pages/services/spectechnika-page";
import OborudovaniePage from "@/pages/services/oborudovanie-page";
import NedvijimostPage from "@/pages/services/nedvijimost-page";
import GruzovyeAvtomobiliPage from "@/pages/services/gruzovye-avtomobili-page";
import VacanciesPage from "@/pages/clients/vacancies";
import DocumentsPage from "@/pages/clients/documents";
import PropertyPage from "@/pages/clients/property";

function Router() {
  return (
    <Switch>
      <Route path="/" component={MainPage} />
      <Route path="/contacts" component={ContactsPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/partners" component={PartnersPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/services/spectechnika" component={SpectechnikaPage} />
      <Route path="/services/oborudovanie" component={OborudovaniePage} />
      <Route path="/services/nedvijimost" component={NedvijimostPage} />
      <Route path="/services/gruzovye-avtomobili" component={GruzovyeAvtomobiliPage} />
      <Route path="/clients/vacancies" component={VacanciesPage} />
      <Route path="/clients/documents" component={DocumentsPage} />
      <Route path="/clients/property" component={PropertyPage} />
      <Route path="/dashboard" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/contracts" component={ContractsPage} />
      <ProtectedRoute path="/acts" component={ActsPage} />
      <ProtectedRoute path="/invoices" component={InvoicesPage} />
      <ProtectedRoute path="/payment-schedule" component={PaymentSchedulePage} />
      <ProtectedRoute path="/other-documents" component={OtherDocumentsPage} />
      <ProtectedRoute path="/change-password" component={ChangePasswordPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;