import { MainLayout } from "@/components/layout/main-layout";
import { AboutSection } from "@/components/main-site/about-section";

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="py-16">
        <AboutSection />
      </div>
    </MainLayout>
  );
};

export default AboutPage;