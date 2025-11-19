import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const testimonials = [
  {
    quote: "Increased my proposal acceptance rate by 40%. Game changer!",
    author: "Sarah Chen",
    role: "Web Developer",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "The AI suggestions helped me stand out from hundreds of applicants.",
    author: "Michael Torres",
    role: "Content Writer",
    avatar: "MT",
    rating: 5,
  },
  {
    quote: "Landing clients is so much easier now. Worth every penny.",
    author: "Emma Rodriguez",
    role: "Graphic Designer",
    avatar: "ER",
    rating: 5,
  },
  {
    quote: "My profile optimization score went from 65% to 95% in one day.",
    author: "David Kim",
    role: "Marketing Specialist",
    avatar: "DK",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  return (
    <section className="py-12 md:py-16 bg-muted/30 overflow-hidden">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="mb-4">What Freelancers Say</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of successful Upwork freelancers
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <Card className="p-8 h-full bg-card hover:shadow-card-hover transition-all duration-300 hover:scale-[1.02] group">
                    <div className="flex items-center justify-between mb-4">
                      <Quote className="h-8 w-8 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-lg mb-6 leading-relaxed italic text-foreground/90">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {testimonial.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
