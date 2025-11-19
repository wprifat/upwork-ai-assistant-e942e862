import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Clock } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="font-heading font-bold mb-4">Get in Touch</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Have a question or need help? We're here to assist you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="animate-fade-in-up">
                <div className="bg-card rounded-lg shadow-card p-8 border border-border">
                  <h2 className="font-heading font-semibold text-2xl mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="How can we help?" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us more about your inquiry..." 
                        required 
                        className="mt-2 min-h-[150px]"
                      />
                    </div>
                    <Button type="submit" variant="hero" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <div className="bg-card rounded-lg shadow-card p-8 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-2">Email Us</h3>
                      <p className="text-muted-foreground">support@upassistify.com</p>
                      <p className="text-sm text-muted-foreground mt-1">We reply within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-card p-8 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-2">Live Chat</h3>
                      <p className="text-muted-foreground">Available for premium users</p>
                      <p className="text-sm text-muted-foreground mt-1">Instant support when you need it</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-lg shadow-card p-8 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg mb-2">Business Hours</h3>
                      <p className="text-muted-foreground">Monday - Friday</p>
                      <p className="text-sm text-muted-foreground mt-1">9:00 AM - 6:00 PM EST</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 border border-primary/20">
                  <h3 className="font-heading font-semibold text-xl mb-3">Quick Response Guarantee</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We pride ourselves on quick response times. All inquiries are answered within 24 hours, 
                    and lifetime members get priority support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
