import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-education.jpg";

export const Hero = () => {
  return (
    <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
      <div className="absolute inset-0 bg-primary/95"></div>
      <div className="container mx-auto max-w-6xl relative z-10 py-16 md:py-20 px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
              Find Your Perfect Online Degree
            </h1>
            <p className="text-lg md:text-xl text-white/95 max-w-xl">
              Compare courses from India's top universities. Make informed decisions about your educational future.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row gap-2 bg-white rounded-lg p-2 shadow-xl">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <Search className="w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, universities, or programs..."
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground bg-transparent"
                  />
                </div>
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-bold text-white">9+</div>
                <div className="text-sm md:text-base text-white/90">Top Universities</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-bold text-white">50+</div>
                <div className="text-sm md:text-base text-white/90">Online Courses</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
                <div className="text-sm md:text-base text-white/90">UGC Approved</div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative hidden md:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={heroImage} 
                alt="Students collaborating in modern learning environment" 
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
