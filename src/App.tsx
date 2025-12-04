import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
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

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route index element={<Index />} />
              <Route path="pricing" element={<Pricing />} />
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
