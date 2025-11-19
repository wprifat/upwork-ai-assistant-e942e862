import { Helmet } from "react-helmet";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Cookie Policy - UpAssistify</title>
        <meta name="description" content="Learn about how UpAssistify uses cookies and similar technologies." />
      </Helmet>
      <Header />
      <main className="flex-1 bg-background">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">Cookie Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">What Are Cookies</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our services.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">How We Use Cookies</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  UpAssistify uses cookies for various purposes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>To keep you signed in and remember your preferences</li>
                  <li>To understand how you interact with our services</li>
                  <li>To improve our website performance and functionality</li>
                  <li>To provide personalized content and recommendations</li>
                  <li>To analyze trends and gather demographic information</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Types of Cookies We Use</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Essential Cookies</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Analytical Cookies</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Functional Cookies</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Targeting Cookies</h3>
                    <p className="text-foreground/80 leading-relaxed">
                      These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant content.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Third-Party Cookies</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We may use third-party services such as Google Analytics and payment processors that also use cookies. These third parties have their own privacy policies governing their use of cookies.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Managing Cookies</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  You have the right to decide whether to accept or reject cookies. You can control cookies through:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Your browser settings - most browsers allow you to refuse or delete cookies</li>
                  <li>Our cookie consent tool when you first visit our website</li>
                  <li>Third-party opt-out mechanisms for advertising cookies</li>
                </ul>
                <p className="text-foreground/80 leading-relaxed mt-4">
                  Please note that blocking some types of cookies may impact your experience on our website and limit the services we can provide.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Updates to This Policy</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Contact Us</h2>
                <p className="text-foreground/80 leading-relaxed">
                  If you have questions about our use of cookies, please contact us at cookies@upassistify.com
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

export default CookiePolicy;
