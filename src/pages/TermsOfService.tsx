import { Helmet } from "react-helmet";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Terms of Service - UpAssistify</title>
        <meta name="description" content="Read the terms and conditions for using UpAssistify services." />
      </Helmet>
      <Header />
      <main className="flex-1 bg-background">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Agreement to Terms</h2>
                <p className="text-foreground/80 leading-relaxed">
                  By accessing or using UpAssistify, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Use License</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We grant you a personal, non-transferable, non-exclusive license to use UpAssistify for your professional development on Upwork, subject to these terms:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>You may not modify or copy our materials</li>
                  <li>You may not use the materials for commercial purposes outside of your personal Upwork activities</li>
                  <li>You may not attempt to reverse engineer any software contained on our platform</li>
                  <li>You may not transfer the materials to another person or entity</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">User Accounts</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  When you create an account with us, you must provide accurate and complete information. You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Subscription and Payments</h2>
                <p className="text-foreground/80 leading-relaxed">
                  Some features of UpAssistify are provided on a subscription basis. By subscribing, you agree to pay the fees associated with your chosen plan. Subscription fees are billed in advance on a monthly or annual basis and are non-refundable except as required by law.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Acceptable Use</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  You agree not to use UpAssistify to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit harmful or malicious code</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Harass, abuse, or harm other users</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Intellectual Property</h2>
                <p className="text-foreground/80 leading-relaxed">
                  All content, features, and functionality of UpAssistify are owned by us and are protected by international copyright, trademark, and other intellectual property laws. You retain ownership of content you create using our tools.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Termination</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We may terminate or suspend your account and access to our services immediately, without prior notice, for any reason, including if you breach these Terms of Service.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Limitation of Liability</h2>
                <p className="text-foreground/80 leading-relaxed">
                  UpAssistify shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Contact Information</h2>
                <p className="text-foreground/80 leading-relaxed">
                  For questions about these Terms of Service, please contact us at legal@upassistify.com
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

export default TermsOfService;
