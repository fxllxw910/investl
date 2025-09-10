import { MainLayout } from "@/components/layout/main-layout";
import { FAQSection } from "@/components/main-site/faq-section";

const FAQPage = () => {
  return (
    <MainLayout>
      <div className="py-16">
        <FAQSection />
      </div>
    </MainLayout>
  );
};

export default FAQPage;