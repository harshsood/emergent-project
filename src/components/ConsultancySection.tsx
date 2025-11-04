import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export const ConsultancySection = () => {
  const services = [
    {
      title: "Domestic Admission",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop",
    },
    {
      title: "International Admission",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    },
    {
      title: "Online Programs",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
    },
  ];

  return (
    <section className="py-16 px-4 bg-card">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Consultancy At Delhi Eduskills
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{service.title}</h3>
                  <ChevronRight className="w-5 h-5 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
