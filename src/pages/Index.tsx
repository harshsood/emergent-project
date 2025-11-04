import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ComparisonWidget } from "@/components/ComparisonWidget";
import { FeatureCards } from "@/components/FeatureCards";
import { CareerGrowthSection } from "@/components/CareerGrowthSection";
import { LogoSlider } from "@/components/LogoSlider";
import { FeaturedCourses } from "@/components/FeaturedCourses";
import { StatsSection } from "@/components/StatsSection";
import { ConsultancySection } from "@/components/ConsultancySection";
import { AlumniSlider } from "@/components/AlumniSlider";
import { EnquiryFormSection } from "@/components/EnquiryFormSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />

        <ComparisonWidget />
        
        <FeatureCards />
        
        <CareerGrowthSection />
        
        <LogoSlider />
        
        <FeaturedCourses />
        
        <StatsSection />
        
        <ConsultancySection />
        
        <AlumniSlider />
        
        <EnquiryFormSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
