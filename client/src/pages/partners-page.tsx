import { MainLayout } from "@/components/layout/main-layout";
import { PartnersSection } from "@/components/main-site/partners-section";

const PartnersPage = () => {
  return (
    <MainLayout>
      <div className="py-16">
        <PartnersSection />
      </div>
    </MainLayout>
  );
};

export default PartnersPage;