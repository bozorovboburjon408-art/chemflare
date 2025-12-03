import { NavLink } from "@/components/NavLink";
import { Atom, Brain, Calculator, Menu, X, GraduationCap, BookOpen, Beaker, Code2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import universityLogo from "@/assets/university-logo.jpg";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { to: "/", icon: Atom, label: "Davriy Jadval" },
    { to: "/reactions", icon: Beaker, label: "Reaksiyalar" },
    { to: "/learning", icon: GraduationCap, label: "O'rganish" },
    { to: "/library", icon: BookOpen, label: "Kitobxona" },
    { to: "/quiz", icon: Brain, label: "Test" },
    { to: "/calculator", icon: Calculator, label: "Kalkulyator" },
    { to: "/developers", icon: Code2, label: "Ishlab chiqaruvchilar" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <img 
              src={universityLogo} 
              alt="Navoiy Davlat Konchilik va Texnologiyalar Universiteti" 
              className="w-10 h-10 rounded-full object-contain"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ChemLearn
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className="px-4 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-200 flex items-center space-x-2 group"
                activeClassName="!text-primary !bg-primary/10 shadow-sm"
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-primary/10"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in border-t border-border/50">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
                activeClassName="!text-primary !bg-primary/10"
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
