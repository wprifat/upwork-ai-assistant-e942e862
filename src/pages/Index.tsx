import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import HeroSection from "@/components/Home/HeroSection";
import HowItWorksSection from "@/components/Home/HowItWorksSection";
import FeaturesSection from "@/components/Home/FeaturesSection";
import PricingSection from "@/components/Home/PricingSection";
import FAQSection from "@/components/Home/FAQSection";
const Index = () => {
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection className="px-0 py-[80px]" />
        <PricingSection className="py-[10px]" />
        <FAQSection />
      </main>
      <Footer />
    </div>;
};
export default Index;