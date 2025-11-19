import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Increased my proposal acceptance rate by 40%. Game changer!",
    author: "Sarah Chen",
    role: "Web Developer",
    avatar: "SC",
  },
  {
    quote: "The AI suggestions helped me stand out from hundreds of applicants.",
    author: "Michael Torres",
    role: "Content Writer",
    avatar: "MT",
  },
  {
    quote: "Landing clients is so much easier now. Worth every penny.",
    author: "Emma Rodriguez",
    role: "Graphic Designer",
    avatar: "ER",
  },
  {
    quote: "My profile optimization score went from 65% to 95% in one day.",
    author: "David Kim",
    role: "Marketing Specialist",
    avatar: "DK",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="mb-4">What Freelancers Say</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands of successful Upwork freelancers
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <Card className="p-8 h-full bg-card hover:shadow-card-hover transition-shadow">
                    <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
                    <p className="text-lg mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
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
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
