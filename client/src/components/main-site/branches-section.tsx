import React from 'react';
import { Container } from "@/components/ui/container";
import RussiaMap from './topo-russia-map';

export const BranchesSection = () => {
  return (
    <section id="branches" className="py-16 md:py-24 bg-background/60">
      <Container>
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
            Наши филиалы
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground">
            Сеть филиалов ИНВЕСТ-ЛИЗИНГ постоянно растет. Мы стремимся быть ближе к клиентам
            и оказывать качественные услуги во всех регионах России.
          </p>
        </div>
        
        <RussiaMap />
      </Container>
    </section>
  );
};

export default BranchesSection;