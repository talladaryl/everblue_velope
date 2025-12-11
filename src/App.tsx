import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle"; // AJOUT
import { useTheme } from "@/contexts/ThemeContext"; // AJOUT
import Layout from "./pages/Layout";
import Index from "./pages/index";
import Pricing from "./pages/Pricing";
import HomePage from "./pages/Home/HomePage";
import NotFound from "./pages/NotFound";
import Builder from "./pages/Builder";
import Messages from "./pages/Messages";
import Events from "./pages/Events";
import Invitations from "./pages/Invitations";
import Inbox from "./pages/Inbox";
import Organizations from "./pages/Organizations";
import InvitationView from "./pages/InvitationView";

const queryClient = new QueryClient();

// Composant de test pour vérifier le thème
const ThemeTestBanner = () => {
  const { theme } = useTheme();

  // En production, tu supprimeras ce composant
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-2 bg-primary border border-primary rounded-lg shadow-lg">
      <span className="text-sm font-medium">
        Thème: {theme === "light" ? "Clair" : "Sombre"}
      </span>
      <ThemeToggle />
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Bannière de test (à supprimer plus tard) */}
            <ThemeTestBanner />

            <Routes>
              <Route index element={<Index />} />
              <Route path="pricing" element={<Pricing />} />

              {/* Page publique d'invitation (sans layout) */}
              <Route path="invitation/:token" element={<InvitationView />} />

              <Route path="/" element={<Layout />}>
                <Route path="designs" element={<HomePage />} />
                <Route path="builder" element={<Builder />} />
                <Route path="messages" element={<Messages />} />
                <Route path="events" element={<Events />} />
                <Route path="invitations" element={<Invitations />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="organizations" element={<Organizations />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
