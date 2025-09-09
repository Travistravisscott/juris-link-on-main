import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Award } from "lucide-react";

const lawyers = [
  {
    id: 1,
    name: "Sarah Mitchell",
    specialty: "Corporate Law",
    experience: "15+ years",
    rating: 4.9,
    reviews: 127,
    location: "New York, NY",
    availability: "Available today",
    hourlyRate: "$250",
    expertise: ["M&A", "Securities", "Corporate Governance"],
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "David Chen",
    specialty: "Real Estate Law",
    experience: "12+ years",
    rating: 4.8,
    reviews: 89,
    location: "Los Angeles, CA",
    availability: "Available tomorrow",
    hourlyRate: "$200",
    expertise: ["Commercial Real Estate", "Property Disputes", "Zoning"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    specialty: "Family Law",
    experience: "10+ years",
    rating: 4.9,
    reviews: 156,
    location: "Chicago, IL",
    availability: "Available now",
    hourlyRate: "$175",
    expertise: ["Divorce", "Child Custody", "Adoption"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face"
  }
];

export const LawyersSection = () => {
  return (
    <section id="lawyers" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Meet Our Expert
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Attorneys</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experienced legal professionals ready to help you with your case
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {lawyers.map((lawyer) => (
            <Card key={lawyer.id} className="group hover:shadow-xl transition-all duration-300 border-primary/10 hover:border-primary/20 overflow-hidden">
              <CardContent className="p-6">
                <div className="relative mb-6">
                  <img 
                    src={lawyer.image}
                    alt={lawyer.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-primary/20"
                  />
                  <Badge 
                    className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 ${
                      lawyer.availability === 'Available now' 
                        ? 'bg-green-100 text-green-700 border-green-200' 
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                    }`}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {lawyer.availability}
                  </Badge>
                </div>

                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-1">{lawyer.name}</h3>
                  <p className="text-primary font-medium">{lawyer.specialty}</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Award className="h-4 w-4 text-accent" />
                    <span className="text-sm text-muted-foreground">{lawyer.experience} experience</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{lawyer.rating}</span>
                    <span>({lawyer.reviews} reviews)</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 mb-4">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{lawyer.location}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-6 justify-center">
                  {lawyer.expertise.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-primary">{lawyer.hourlyRate}/hr</div>
                  <div className="text-sm text-muted-foreground">Consultation rate</div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300">
                    Book Consultation
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Attorneys
          </Button>
        </div>
      </div>
    </section>
  );
};