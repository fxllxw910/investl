import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
  website?: string;
}

export const PartnersSection = () => {
  const partners: Partner[] = [
    {
      id: 1,
      name: "ПАО Сбербанк",
      logo: "/partners/sberbank.svg",
      description: "Крупнейший банк в России, Центральной и Восточной Европе, один из ведущих международных финансовых институтов.",
      website: "https://www.sberbank.ru"
    },
    {
      id: 2,
      name: "Банк ВТБ",
      logo: "/partners/vtb.svg",
      description: "Один из крупнейших участников российского рынка банковских услуг, предоставляющий широкий спектр услуг для корпоративных клиентов и частных лиц.",
      website: "https://www.vtb.ru"
    },
    {
      id: 3,
      name: "Газпромбанк",
      logo: "/partners/gazprombank.svg",
      description: "Один из крупнейших универсальных финансовых институтов России, предоставляющий широкий спектр банковских, финансовых, инвестиционных продуктов и услуг.",
      website: "https://www.gazprombank.ru"
    },
    {
      id: 4,
      name: "Альфа-Банк",
      logo: "/partners/alfabank.svg",
      description: "Крупнейший частный банк России, предоставляющий полный спектр услуг как для частных, так и для корпоративных клиентов.",
      website: "https://www.alfabank.ru"
    },
    {
      id: 5,
      name: "Росбанк",
      logo: "/partners/rosbank.svg",
      description: "Универсальный банк, предоставляющий полный комплекс банковских услуг, часть международной финансовой группы.",
      website: "https://www.rosbank.ru"
    },
    {
      id: 6,
      name: "Тинькофф Банк",
      logo: "/partners/tinkoff.svg",
      description: "Онлайн-банк, работающий без физических отделений, предлагающий полный спектр финансовых услуг для физических и юридических лиц.",
      website: "https://www.tinkoff.ru"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden" id="partners">
      <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-primary opacity-5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Наши партнеры</h2>
          <p className="text-muted-foreground text-lg">
            Мы сотрудничаем с ведущими финансовыми институтами и поставщиками техники
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {partners.map((partner) => (
            <Card key={partner.id} className="p-6 glass backdrop-blur-sm bg-background/30 flex flex-col h-full">
              <div className="h-20 mb-6 flex items-center justify-center">
                <div className="h-16 w-48 bg-white/70 rounded-md flex items-center justify-center">
                  {/* Этот блок имитирует логотип, в реальном проекте будет использоваться настоящий логотип */}
                  <div className="text-xl font-bold text-gray-700">{partner.name}</div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-3">{partner.name}</h3>
              <p className="text-muted-foreground mb-6 flex-grow">{partner.description}</p>
              
              {partner.website && (
                <Button variant="glass-outline" className="mt-auto" asChild>
                  <a href={partner.website} target="_blank" rel="noopener noreferrer">
                    Посетить сайт
                  </a>
                </Button>
              )}
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-lg mb-6">
            Заинтересованы в сотрудничестве? Свяжитесь с нами для обсуждения возможностей партнерства.
          </p>
          <Button asChild size="lg" variant="glass-primary">
            <Link href="/contacts">
              <a>Стать партнером</a>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};