import { Helmet } from "react-helmet";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Disclaimer - UpAssistify</title>
        <meta name="description" content="Important disclaimers regarding the use of UpAssistify services." />
      </Helmet>
      <Header />
      <main className="flex-1 bg-background">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">Disclaimer</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">General Information</h2>
                <p className="text-foreground/80 leading-relaxed">
                  The information provided by UpAssistify is for general informational purposes only. All information on the platform is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">No Professional Advice</h2>
                <p className="text-foreground/80 leading-relaxed">
                  UpAssistify is a tool designed to assist with job applications on Upwork. The content and suggestions provided are not professional career advice, legal advice, or guaranteed to result in job offers. You should consult with appropriate professionals regarding your specific circumstances.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">AI-Generated Content</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Our platform uses artificial intelligence to generate cover letters and analyze job postings. While we strive for accuracy, AI-generated content may contain errors, inconsistencies, or inappropriate suggestions. Users are solely responsible for reviewing, editing, and verifying all AI-generated content before use.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">No Guarantee of Results</h2>
                <p className="text-foreground/80 leading-relaxed">
                  UpAssistify does not guarantee that using our services will result in job offers, increased earnings, or improved success rates on Upwork. Your success depends on many factors including your skills, experience, market conditions, and how you apply the tools we provide.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Third-Party Platforms</h2>
                <p className="text-foreground/80 leading-relaxed">
                  UpAssistify is an independent service and is not affiliated with, endorsed by, or sponsored by Upwork. Upwork is a trademark of Upwork Inc. Your use of Upwork is subject to their terms of service and policies, which we have no control over.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">External Links</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Our platform may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Use at Your Own Risk</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Your use of UpAssistify and any reliance on the information provided is strictly at your own risk. We will not be liable for any loss or damage including, without limitation, indirect or consequential loss or damage arising from the use of our services.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Service Availability</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We strive to provide uninterrupted service, but we do not guarantee that our platform will always be available, error-free, or free from viruses or other harmful components. We reserve the right to modify, suspend, or discontinue any part of our services at any time.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Fair Use Policy</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Users are expected to use our services responsibly and in accordance with applicable laws and regulations. We reserve the right to terminate accounts that violate our fair use policies or engage in abusive behavior.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Contact Information</h2>
                <p className="text-foreground/80 leading-relaxed">
                  If you have any questions about this Disclaimer, please contact us at support@upassistify.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Disclaimer;
