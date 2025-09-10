
import React, { useState, useEffect } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Calculator, ExternalLink, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Компонент для отображения карточки имущества
const PropertyItem = ({ 
  title, 
  price, 
  description, 
  imageUrl,
  avitoUrl 
}: { 
  title: string; 
  price: string; 
  description: string;
  imageUrl: string;
  avitoUrl: string;
}) => {
  return (
    <div className="bg-background rounded-lg shadow-md overflow-hidden border border-border">
      <div className="h-64 overflow-hidden relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-equipment.jpg';
          }}
        />
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded font-medium">
          {price}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground mb-5">{description}</p>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calculator size={16} />
            Расчет лизинга
          </Button>
          <Button variant="default" className="gap-2" asChild>
            <a href={avitoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              Подробнее на Авито
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

// Компонент для загрузки объявлений
const AvitoListings = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/avito-listings');
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных');
      }
      const data = await response.json();
      setListings(data.listings || []);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Не удалось загрузить объявления');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    
    // Автоматическое обновление каждые 30 минут
    const interval = setInterval(() => {
      fetchListings();
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Актуальные объявления</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Обновлено: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchListings} 
            disabled={loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Обновить
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-center text-red-500 mb-4">
            {error}
          </div>
        )}
        
        {loading && listings.length === 0 ? (
          <div className="text-center py-8">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Загружаем объявления...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {listings.map((item, index) => (
              <PropertyItem 
                key={index}
                title={item.title}
                price={item.price}
                description={item.description}
                imageUrl={item.imageUrl}
                avitoUrl={item.avitoUrl}
              />
            ))}
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mt-4">
          Объявления автоматически обновляются каждые 30 минут. 
          Для просмотра полной информации перейдите на сайт Авито.
        </p>
      </CardContent>
    </Card>
  );
};

export default function PropertyPage() {
  return (
    <MainLayout>
      <section className="py-20 relative">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Реализация изъятого имущества</h1>
            <p className="text-muted-foreground text-lg">
              Предлагаем к приобретению имущество по выгодным ценам
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            
            {/* Компонент с объявлениями Авито */}
            <AvitoListings />
            
            
            
            
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
