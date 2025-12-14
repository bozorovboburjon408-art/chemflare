import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PeriodicTable from "./pages/PeriodicTable";
import Quiz from "./pages/Quiz";
import Calculator from "./pages/Calculator";
import Auth from "./pages/Auth";
import Learning from "./pages/Learning";
import Library from "./pages/Library";
import ChemicalReactions from "./pages/ChemicalReactions";
import Developers from "./pages/Developers";
import ApiSettings from "./pages/ApiSettings";
import Experiments from "./pages/Experiments";
import NotFound from "./pages/NotFound";
import IntroAnimation from "./components/IntroAnimation";

const queryClient = new QueryClient();

const App = () => {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PeriodicTable />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/learning" element={<Learning />} />
            <Route path="/library" element={<Library />} />
            <Route path="/reactions" element={<ChemicalReactions />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/api-settings" element={<ApiSettings />} />
            <Route path="/auth" element={<Auth />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
