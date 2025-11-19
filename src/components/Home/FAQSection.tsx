import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does the job match analyzer work?",
      answer: "Our AI analyzes your profile and job postings to calculate compatibility scores across skills, experience, and portfolio relevance."
    },
    {
      question: "Can I use this with my existing Upwork account?",
      answer: "Yes! Simply paste your profile URL or job posting link. No login credentials needed."
    },
    {
      question: "What's included in the lifetime deal?",
      answer: "Unlimited analyses, AI optimization, priority support, and all future updates - one-time payment, no recurring fees."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee."
    },
    {
      question: "Can I upgrade from monthly to lifetime?",
      answer: "Absolutely! Your previous month's payment will be credited toward the lifetime price."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, all data is encrypted and never shared with third parties. You can delete your data anytime."
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading font-bold mb-4">
            FAQ
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Quick answers to common questions
          </p>
        </div>

        <div className="max-w-3xl mx-auto animate-fade-in">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-lg shadow-card border border-border px-6"
              >
                <AccordionTrigger className="text-left font-heading font-semibold text-lg hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-16 text-center animate-fade-in">
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <a href="/contact" className="text-primary hover:underline font-semibold">
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
