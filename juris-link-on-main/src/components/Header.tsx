import { Button } from "@/components/ui/button";
import { Scale, Phone, Mail } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">LegalConsult</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-foreground hover:text-primary transition-colors">Services</a>
            <a href="#lawyers" className="text-foreground hover:text-primary transition-colors">Our Lawyers</a>
            <a href="#about" className="text-foreground hover:text-primary transition-colors">About</a>
            <a href="#contact" className="text-foreground hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>info@legalconsult.com</span>
              </div>
            </div>
            <Button variant="outline" size="sm">Login</Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300">
              Book Consultation
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};