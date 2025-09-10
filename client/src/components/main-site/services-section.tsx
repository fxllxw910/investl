import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

type ServiceCardProps = {
  title: string;
  href: string;
  imageUrl: string;
};

const ServiceCard = ({ title, href, imageUrl }: ServiceCardProps) => {
  return (
    <Link href={href}>
      <div className="block group cursor-pointer">
        <Card className="overflow-hidden glass backdrop-blur-sm bg-background/30 transition-all duration-300 group-hover:shadow-xl border-border h-full">
          <div className="relative overflow-hidden aspect-[16/9]">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <div className="flex items-center text-primary opacity-0 transform translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Подробнее <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Link>
  );
};

export const ServicesSection = () => {
  const services = [
    {
      title: "Спецтехника",
      href: "/services/spectechnika",
      imageUrl: "https://www.investl.ru/upload/iblock/98a/f010903dlnn3hpojsb78yw2bxy01p6hq.jpg"
    },
    {
      title: "Оборудование",
      href: "/services/oborudovanie",
      imageUrl: "https://www.investl.ru/upload/iblock/820/ihc8bc040ttyajj79ktclack2j5zxmtx.jpg"
    },
    {
      title: "Недвижимость",
      href: "/services/nedvijimost",
      imageUrl: "https://www.investl.ru/upload/iblock/231/ltsbxmgv90651vmmryronip3dn320lns.jpg"
    },
    {
      title: "Легковые и грузовые автомобили",
      href: "/services/gruzovye-avtomobili",
      imageUrl: "https://www.investl.ru/upload/iblock/cdf/vjhbwdw8m9e6emeb1jocekic37t4uhpj.jpg"
    }
  ];

  return (
    <section id="services" className="py-20 relative overflow-hidden">
      {/* Subtle background effects for VisionOS look */}
      <div className="absolute top-40 left-40 w-96 h-96 rounded-full bg-primary opacity-5 blur-3xl"></div>
      <div className="absolute bottom-40 right-40 w-96 h-96 rounded-full bg-primary opacity-5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Подбираем лизинговые продукты под каждого клиента</h2>
          <p className="text-muted-foreground text-lg">
            ООО «ИНВЕСТ-лизинг» - надежный партнер для всех, кто стремится к успешному развитию своего бизнеса. 
            Наша команда нацелена на долгосрочные партнерские отношения с клиентами и всегда идет навстречу их потребностям.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard 
              key={index}
              title={service.title}
              href={service.href}
              imageUrl={service.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};