import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Clock, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-legal.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-secondary/20 to-accent/10">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Expert Legal
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Consultation</span>
                <br />Made Simple
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect with qualified lawyers and legal advisors through our secure platform. 
                Get professional legal guidance without leaving your home.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-xl transition-all duration-300 text-lg px-8 py-6">
                Start Free Consultation
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/20 hover:border-primary/40">
                Browse Lawyers
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Secure</div>
              </Card>
              <Card className="p-4 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <Clock className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </Card>
              <Card className="p-4 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Lawyers</div>
              </Card>
              <Card className="p-4 text-center border-primary/10 hover:border-primary/20 transition-colors">
                <Award className="h-8 w-8 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Cases Won</div>
              </Card>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Professional legal consultation environment"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-primary to-accent p-6 rounded-xl text-white shadow-xl">
              <div className="text-3xl font-bold">98%</div>
              <div className="text-sm opacity-90">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};