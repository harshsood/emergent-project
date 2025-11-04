import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, HeadphonesIcon, Target, TrendingUp } from "lucide-react";

export const FeatureCards = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Top Universities Courses",
    },
    {
      icon: HeadphonesIcon,
      title: "Hassle Free Learning Services",
    },
    {
      icon: Target,
      title: "Industry Focused Education",
    },
    {
      icon: TrendingUp,
      title: "Tailored Pathways for Career Advancement",
    },
  ];

  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6 pb-6">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-sm md:text-base font-semibold leading-tight">
                  {feature.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
