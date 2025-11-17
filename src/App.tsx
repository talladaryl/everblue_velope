import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./pages/Layout";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";

import NotFound from "./pages/NotFound";
import Builder from "./pages/Builder";
// optional stub pages (create files if not present)
import Messages from "./pages/Messages";
import Events from "./pages/Events";
import Invitations from "./pages/Invitations";
import Inbox from "./pages/Inbox";
// import MobileApp from "./pages/MobileApp";
// import Help from "./pages/Help";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="designs" replace />} />
            <Route path="designs" element={<HomePage />} />
            <Route path="builder" element={<Builder />} />
            <Route path="messages" element={<Messages />} />
            <Route path="events" element={<Events />} />
            <Route path="invitations" element={<Invitations />} />
            <Route path="inbox" element={<Inbox />} />
            {/* <Route path="mobile" element={<MobileApp />} />
            <Route path="help" element={<Help />} /> */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
