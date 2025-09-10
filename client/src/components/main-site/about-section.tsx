import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { CheckCircle2, Trophy, Users, Clock, MapPin, Building } from "lucide-react";

export const AboutSection = () => {
  const stats = [
    { 
      label: "Лет опыта", 
      value: "20+", 
      icon: <Clock className="h-6 w-6 text-primary" /> 
    },
    { 
      label: "Реализованных проектов", 
      value: "1000+", 
      icon: <Trophy className="h-6 w-6 text-primary" /> 
    },
    { 
      label: "Филиалов в России", 
      value: "9", 
      icon: <MapPin className="h-6 w-6 text-primary" /> 
    },
    { 
      label: "Компаний-партнеров", 
      value: "50+", 
      icon: <Building className="h-6 w-6 text-primary" /> 
    }
  ];
  
  const achievements = [
    "Более 20 лет успешной работы в области лизинга",
    "Официальный партнер ведущих поставщиков специальной техники",
    "Гибкие лизинговые программы под индивидуальные потребности",
    "Работа на всей территории Российской Федерации",
    "Высокий уровень одобрения заявок",
    "Команда профессионалов с многолетним опытом"
  ];

  return (
    <section className="py-20 relative overflow-hidden" id="about">
      <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-primary opacity-5 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">О компании ИНВЕСТ-ЛИЗИНГ</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Компания «ИНВЕСТ-ЛИЗИНГ» осуществляет лизинговую деятельность с 2003 года. За это время мы 
              приобрели огромный опыт в области лизинга, предоставив нашим клиентам возможность 
              приобрести различные виды основных фондов.
            </p>
            
            <div className="space-y-4 mb-8">
              {achievements.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
            
            <Button asChild size="lg" className="mt-4">
              <Link href="/contacts">
                <a>Связаться с нами</a>
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center glass backdrop-blur-sm bg-background/30">
                <div className="flex justify-center mb-3">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="mt-20">
          <div className="glass backdrop-blur-sm bg-background/30 rounded-lg p-8 border border-border">
            <h3 className="text-2xl font-semibold mb-6">Наша миссия</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Наша миссия – обеспечить доступное финансирование для развития бизнеса наших клиентов, 
              предоставляя качественные лизинговые решения и высокий уровень сервиса.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-medium mb-2">Клиентоориентированность</h4>
                <p className="text-muted-foreground">
                  Мы разрабатываем индивидуальные предложения с учетом потребностей каждого клиента
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-medium mb-2">Профессионализм</h4>
                <p className="text-muted-foreground">
                  Наша команда состоит из опытных специалистов с глубоким пониманием лизингового рынка
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 rounded-full p-4 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-xl font-medium mb-2">Надежность</h4>
                <p className="text-muted-foreground">
                  Более 20 лет успешной работы на рынке лизинга и тысячи реализованных проектов
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};