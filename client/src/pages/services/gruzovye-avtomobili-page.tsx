import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export default function GruzovyeAvtomobiliPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация обязательных полей
    if (!formData.name.trim()) {
      alert('Пожалуйста, введите ваше имя');
      return;
    }
    
    if (!formData.phone.trim()) {
      alert('Пожалуйста, введите ваш телефон');
      return;
    }
    
    if (!formData.email.trim()) {
      alert('Пожалуйста, введите ваш email');
      return;
    }
    
    if (!formData.vehicle) {
      alert('Пожалуйста, выберите тип транспорта');
      return;
    }
    
    // Простая валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Пожалуйста, введите корректный email адрес');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/send-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          serviceType: 'Автотранспорт',
          recipientEmail: 'inv.lizing@yandex.ru'
        }),
      });
      
      if (response.ok) {
        alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          vehicle: '',
          comment: ''
        });
      } else {
        alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error sending application:', error);
      alert('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <MainLayout>
      <main className="flex-1">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-10"></div>
          <div className="absolute inset-0 bg-[url('/bg-trucks.jpg')] bg-cover bg-center opacity-15"></div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">Лизинг автотранспорта</h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Компания "Инвест-Лизинг" предлагает выгодные условия лизинга легковых и грузовых автомобилей для вашего бизнеса.
                Мы поможем обновить автопарк вашей компании на выгодных условиях.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  onClick={() => {
                    const element = document.getElementById('application');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Оставить заявку
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => {
                    const element = document.getElementById('benefits');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Преимущества
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30" id="benefits">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Преимущества лизинга автотранспорта</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Минимальный аванс</h3>
                <p className="text-muted-foreground">
                  От 10% стоимости автомобиля, что позволяет существенно снизить первоначальные затраты
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Быстрое оформление</h3>
                <p className="text-muted-foreground">
                  Решение по заявке принимается в течение 1-2 рабочих дней при минимальном пакете документов
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Налоговые преимущества</h3>
                <p className="text-muted-foreground">
                  Лизинговые платежи полностью относятся на себестоимость, а НДС принимается к вычету
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Страхование включено</h3>
                <p className="text-muted-foreground">
                  Страхование КАСКО и ОСАГО уже включено в лизинговые платежи
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Гибкий график платежей</h3>
                <p className="text-muted-foreground">
                  Возможность выбора графика платежей с учетом сезонности бизнеса
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Полное сервисное обслуживание</h3>
                <p className="text-muted-foreground">
                  Возможность включения в договор регулярного технического обслуживания автомобиля
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Виды автотранспорта для лизинга</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="rounded-xl overflow-hidden group">
                <div className="h-64 relative">
                  <img 
                    src="/cars.jpg" 
                    alt="Легковые автомобили"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Легковые автомобили</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Служебные и представительские автомобили любых марок для корпоративных нужд
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const element = document.getElementById('application');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Оформить заявку <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden group">
                <div className="h-64 relative">
                  <img 
                    src="/trucks.jpg" 
                    alt="Грузовые автомобили"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Грузовые автомобили</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Грузовики, самосвалы, седельные тягачи и другие транспортные средства для перевозки грузов
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const element = document.getElementById('application');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Оформить заявку <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden group">
                <div className="h-64 relative">
                  <img 
                    src="/commercial-vehicles.jpg" 
                    alt="Коммерческий транспорт"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Коммерческий транспорт</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Микроавтобусы, фургоны, рефрижераторы и другие специализированные транспортные средства
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const element = document.getElementById('application');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Оформить заявку <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30" id="application">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Оставить заявку на лизинг автотранспорта</h2>
              <p className="text-center text-muted-foreground mb-8">
                Заполните форму ниже, и наш специалист свяжется с вами в ближайшее время для консультации и расчета лизинговых платежей
              </p>

              <div className="p-8 rounded-lg glass backdrop-blur-sm bg-background/30">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block font-medium">
                        Ваше имя *
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Иван Иванов"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block font-medium">
                        Телефон *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="+7 (___) ___-__-__"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-medium">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="example@company.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="vehicle" className="block font-medium">
                      Тип транспорта *
                    </label>
                    <select
                      id="vehicle"
                      value={formData.vehicle}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    >
                      <option value="">Выберите тип транспорта</option>
                      <option value="car">Легковой автомобиль</option>
                      <option value="truck">Грузовой автомобиль</option>
                      <option value="commercial">Коммерческий транспорт</option>
                      <option value="other">Другое (укажите в комментарии)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="comment" className="block font-medium">
                      Комментарий
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={formData.comment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Укажите марку, модель автомобиля, предполагаемый срок лизинга и другие детали"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? 'Отправляем...' : 'Отправить заявку'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}