import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Home, 
  Users, 
  FileText, 
  Briefcase, 
  Heart,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: Building2,
    title: "Corporate Law",
    description: "Business formation, contracts, mergers & acquisitions, and corporate governance.",
    price: "Starting at $200/hr"
  },
  {
    icon: Home,
    title: "Real Estate Law",
    description: "Property transactions, landlord-tenant disputes, and real estate contracts.",
    price: "Starting at $150/hr"
  },
  {
    icon: Users,
    title: "Family Law",
    description: "Divorce, custody, adoption, and family dispute resolution services.",
    price: "Starting at $175/hr"
  },
  {
    icon: FileText,
    title: "Contract Law",
    description: "Contract drafting, review, negotiation, and dispute resolution.",
    price: "Starting at $125/hr"
  },
  {
    icon: Briefcase,
    title: "Employment Law",
    description: "Workplace disputes, discrimination claims, and employment contracts.",
    price: "Starting at $180/hr"
  },
  {
    icon: Heart,
    title: "Personal Injury",
    description: "Accident claims, medical malpractice, and personal injury litigation.",
    price: "Contingency Available"
  }
];

export const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Comprehensive Legal
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Services</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our experienced attorneys provide expert guidance across various legal domains
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-accent">{service.price}</span>
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};