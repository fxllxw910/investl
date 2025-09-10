import { MainLayout } from "@/components/layout/main-layout";
import { ContactsSection } from "@/components/main-site/contacts-section";

const ContactsPage = () => {
  return (
    <MainLayout>
      <div className="py-16">
        <ContactsSection />
      </div>
    </MainLayout>
  );
};

export default ContactsPage;