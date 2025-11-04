import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const CareerGrowthSection = () => {
  const courses = [
    "Business Management",
    "Brands, Sales & Marketing",
    "Strategy & Leadership",
    "Human Resource Management",
    "Project/Product Management",
    "IT & Finance",
    "Healthcare",
    "General Management",
  ];

  const stats = [
    {
      value: "7x",
      description: "Experience Cutting-Edge Online Higher Education Consultancy with Delhi",
    },
    {
      value: "7x",
      description: "Experience Cutting-Edge Online Higher Education Consultancy with Delhi",
    },
    {
      value: "98%",
      description: "Experience Cutting-Edge Online Higher Education Consultancy with Delhi",
    },
  ];

  return (
    <section className="py-16 px-4 bg-card">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Best Career Growth
        </h2>
        <p className="text-xl md:text-2xl font-semibold mb-8">
          Courses for Professionals
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left side - Course list */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Heading</h3>
            <ul className="space-y-2">
              {courses.map((course, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="text-sm md:text-base">{course}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right side - Stats */}
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 pb-6">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
            <Button variant="link" className="pl-0 text-primary">
              Know More About Course
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
