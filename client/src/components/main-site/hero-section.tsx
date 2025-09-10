import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export const HeroSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/40"></div>
      
      {/* Blurred circles for VisionOS aesthetic */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary opacity-10 blur-3xl"></div>
      <div className="absolute bottom-10 left-20 w-72 h-72 rounded-full bg-primary opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div className="max-w-2xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              ПАРТНЁРСТВО ДЛЯ УСПЕХА
            </h1>
            <p className="text-xl mb-8 text-muted-foreground">
              Подберем финансовый инструмент для вашего бизнеса
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="glass-primary" asChild>
                <a href="#services">
                  Наши услуги
                </a>
              </Button>
              <Button size="lg" variant="glass-outline" asChild>
                <a href="#calculator">
                  Оставить заявку
                </a>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
              <div className="text-center glass backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">4000+</div>
                <div className="text-sm text-muted-foreground">Договоров</div>
              </div>
              <div className="text-center glass backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">1500+</div>
                <div className="text-sm text-muted-foreground">Партнеров</div>
              </div>
              <div className="text-center glass backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">32 млрд+</div>
                <div className="text-sm text-muted-foreground">Стоимость договоров</div>
              </div>
              <div className="text-center glass backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Международных контрактов</div>
              </div>
            </div>
          </div>
          
          {/* Hero image with glass effect */}
          <div className="relative">
            <div className="glass backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden max-w-md">
              <img 
                src="https://www.investl.ru/upload/iblock/1ff/v0t0aezzl0szir58nxzrn33lyqivwuun.gif" 
                alt="Бизнес партнерство" 
                className="w-full h-auto rounded-2xl" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};