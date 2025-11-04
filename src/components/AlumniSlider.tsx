import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import amityLogo from "@/assets/logos/amity.jpg";
import nmimLogo from "@/assets/logos/nmims.jpg";
import lpuLogo from "@/assets/logos/lpu.jpg";
import smuLogo from "@/assets/logos/smu.jpg";
import mujLogo from "@/assets/logos/muj.jpg";
import dypatilLogo from "@/assets/logos/dypatil.jpg";
import chandigarhLogo from "@/assets/logos/chandigarh.jpg";
import jindalLogo from "@/assets/logos/jindal.jpg";
import srmLogo from "@/assets/logos/srm.jpg";

export const AlumniSlider = () => {
  const universities = [
    { name: "Amity University", logo: amityLogo },
    { name: "NMIMS", logo: nmimLogo },
    { name: "LPU", logo: lpuLogo },
    { name: "SMU", logo: smuLogo },
    { name: "Manipal University Jaipur", logo: mujLogo },
    { name: "DY Patil", logo: dypatilLogo },
    { name: "Chandigarh University", logo: chandigarhLogo },
    { name: "Jindal University", logo: jindalLogo },
    { name: "SRM University", logo: srmLogo },
  ];

  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-8">
          Our Alumni Works At
        </h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {universities.map((university, index) => (
              <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/6">
                <div className="p-2">
                  <div className="bg-white rounded-lg p-4 flex items-center justify-center h-20 hover:shadow-md transition-shadow">
                    <img
                      src={university.logo}
                      alt={university.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
