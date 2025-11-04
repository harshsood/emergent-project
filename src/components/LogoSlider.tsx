import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import amityLogo from "@/assets/logos/amity.jpg";
import nmimsLogo from "@/assets/logos/nmims.jpg";
import lpuLogo from "@/assets/logos/lpu.jpg";
import smuLogo from "@/assets/logos/smu.jpg";
import mujLogo from "@/assets/logos/muj.jpg";
import dypatilLogo from "@/assets/logos/dypatil.jpg";
import chandigarhLogo from "@/assets/logos/chandigarh.jpg";
import jindalLogo from "@/assets/logos/jindal.jpg";
import srmLogo from "@/assets/logos/srm.jpg";
import Autoplay from "embla-carousel-autoplay";

const universities = [
  { name: "Amity University", logo: amityLogo },
  { name: "NMIMS", logo: nmimsLogo },
  { name: "Lovely Professional University", logo: lpuLogo },
  { name: "Sikkim Manipal University", logo: smuLogo },
  { name: "Manipal University Jaipur", logo: mujLogo },
  { name: "DY Patil University", logo: dypatilLogo },
  { name: "Chandigarh University", logo: chandigarhLogo },
  { name: "OP Jindal University", logo: jindalLogo },
  { name: "SRM University", logo: srmLogo },
];

export const LogoSlider = () => {
  return (
    <section className="py-12 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Our University Partners
          </h2>
          <p className="text-muted-foreground">
            Top UGC-approved universities offering quality online education
          </p>
        </div>
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
              <CarouselItem
                key={index}
                className="basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <div className="p-4">
                  {/* increased container height and spacing for larger, more natural-looking logos */}
                  <div className="bg-card rounded-lg border border-border p-6 flex items-center justify-center h-36 md:h-40 lg:h-44 hover:shadow-card transition-shadow">
                    <img
                      src={university.logo}
                      alt={university.name}
                      className="max-h-full max-w-[220px] object-contain transition-transform duration-200 hover:scale-105 grayscale hover:grayscale-0"
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
