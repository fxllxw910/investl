import React from 'react';
import { Container } from "@/components/ui/container";
import RussiaMap from './topo-russia-map';

export const ContactsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden" id="contacts">
      <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-primary opacity-5 blur-3xl"></div>
      
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Контакты</h2>
          <p className="text-muted-foreground text-lg">
            Свяжитесь с нами для получения консультации по вопросам лизинга
          </p>
        </div>
        
        <div className="mb-12">
          <RussiaMap />
        </div>
      </Container>
    </section>
  );
};