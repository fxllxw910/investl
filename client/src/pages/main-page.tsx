import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/components/main-site/hero-section";
import { ServicesSection } from "@/components/main-site/services-section";
import { AdvantagesSection } from "@/components/main-site/advantages-section";
import { LeasingCalculator } from "@/components/main-site/leasing-calculator";
import { ContactsSection } from "@/components/main-site/contacts-section";

const MainPage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <ServicesSection />
      <AdvantagesSection />
      <LeasingCalculator />
      <ContactsSection />
    </MainLayout>
  );
};

export default MainPage;