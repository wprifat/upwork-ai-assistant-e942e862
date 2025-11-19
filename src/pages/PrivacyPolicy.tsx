import { Helmet } from "react-helmet";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Privacy Policy - UpAssistify</title>
        <meta name="description" content="Learn how UpAssistify collects, uses, and protects your personal information." />
      </Helmet>
      <Header />
      <main className="flex-1 bg-background">
        <div className="container-custom py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading font-bold text-4xl md:text-5xl mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Introduction</h2>
                <p className="text-foreground/80 leading-relaxed">
                  At UpAssistify, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered tools for Upwork success.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Information We Collect</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information (professional skills, hourly rate, portfolio)</li>
                  <li>Payment information for subscription processing</li>
                  <li>Job application data and cover letters you create using our tools</li>
                  <li>Usage data and analytics to improve our services</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">How We Use Your Information</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Provide, maintain, and improve our AI-powered services</li>
                  <li>Process your transactions and send related information</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Protect against fraudulent or illegal activity</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Data Security</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Third-Party Services</h2>
                <p className="text-foreground/80 leading-relaxed">
                  We may use third-party service providers to process payments, analyze data, and provide customer support. These providers have access to your information only to perform specific tasks on our behalf and are obligated to protect your information.
                </p>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Your Rights</h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Rectify inaccurate personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="font-heading font-semibold text-2xl mb-4">Contact Us</h2>
                <p className="text-foreground/80 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at privacy@upassistify.com
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

export default PrivacyPolicy;
