import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does the AI job match analyzer work?",
      answer: "Our AI analyzes both your Upwork profile and the job posting to calculate compatibility across multiple dimensions including skills match, experience level, portfolio relevance, and success probability. It uses advanced natural language processing to understand context and provide accurate match scores."
    },
    {
      question: "Can I use this with my existing Upwork account?",
      answer: "Yes! UpAssistify works seamlessly with any Upwork account. Simply paste your profile URL or job posting link, and our AI will do the rest. You don't need to share your login credentials or connect your account."
    },
    {
      question: "What's included in the lifetime deal?",
      answer: "The lifetime deal includes unlimited job analyses, AI cover letter optimization, profile insights, priority support, and all future updates - forever. It's a one-time payment with no recurring fees."
    },
    {
      question: "How accurate are the job match scores?",
      answer: "Our AI has been trained on thousands of successful Upwork proposals and maintains an accuracy rate of over 85%. The scores consider multiple factors including skills alignment, experience level, portfolio relevance, and historical success patterns."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with UpAssistify for any reason, contact our support team within 30 days of purchase for a full refund."
    },
    {
      question: "Can I upgrade from monthly to lifetime?",
      answer: "Absolutely! You can upgrade from the monthly plan to the lifetime deal at any time. We'll credit your previous month's payment toward the lifetime price."
    },
    {
      question: "How does the cover letter optimizer work?",
      answer: "Our AI analyzes both the job requirements and your profile to suggest personalized improvements for your cover letter. It identifies key points to emphasize, suggests better phrasing, and helps you stand out from other applicants."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take security seriously. All data is encrypted in transit and at rest. We never share your information with third parties, and you can delete your data at any time from your dashboard."
    }
  ];

  return (
    <section id="faq" className="py-20 md:py-32">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="font-heading font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about UpAssistify
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
