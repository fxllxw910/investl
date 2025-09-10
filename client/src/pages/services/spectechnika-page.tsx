import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export default function SpectechnikaPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    equipment: '',
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
    
    if (!formData.equipment) {
      alert('Пожалуйста, выберите тип техники');
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
          serviceType: 'Спецтехника',
          recipientEmail: 'inv.lizing@yandex.ru'
        }),
      });
      
      if (response.ok) {
        alert('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
        setFormData({
          name: '',
          phone: '',
          email: '',
          equipment: '',
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
          <div className="absolute inset-0 bg-[url('/bg-spectechnika.jpg')] bg-cover bg-center opacity-15"></div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">Лизинг спецтехники</h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Компания "Инвест-Лизинг" предлагает выгодные условия лизинга спецтехники для бизнеса любого масштаба. 
                Мы помогаем приобрести строительную, сельскохозяйственную, коммунальную и другую спецтехнику на оптимальных условиях.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Преимущества лизинга спецтехники</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Минимальный первоначальный взнос</h3>
                <p className="text-muted-foreground">
                  От 10% стоимости приобретаемой техники, что позволяет сохранить оборотные средства
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Гибкие условия</h3>
                <p className="text-muted-foreground">
                  Индивидуальный график платежей с учетом сезонности бизнеса и особенностей денежных потоков
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ускоренная амортизация</h3>
                <p className="text-muted-foreground">
                  Позволяет оптимизировать налогообложение и обновлять парк техники быстрее
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Налоговые преимущества</h3>
                <p className="text-muted-foreground">
                  НДС в составе лизинговых платежей принимается к вычету, а сами платежи относятся на себестоимость
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Быстрое оформление</h3>
                <p className="text-muted-foreground">
                  Минимальный пакет документов и быстрое принятие решения по заявке — от 1 дня
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Страхование включено</h3>
                <p className="text-muted-foreground">
                  Комплексное страхование техники уже включено в лизинговые платежи
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Виды спецтехники для лизинга</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="rounded-xl overflow-hidden group">
                <div className="h-64 relative">
                  <img 
                    src="/construction-equipment.jpg" 
                    alt="Строительная техника"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Строительная техника</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Экскаваторы, погрузчики, бульдозеры, краны, асфальтоукладчики и другая техника для строительства
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
                    src="/agricultural-equipment.jpg" 
                    alt="Сельскохозяйственная техника"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Сельскохозяйственная техника</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Тракторы, комбайны, сеялки, опрыскиватели и другая техника для сельского хозяйства
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
                    src="/municipal-equipment.jpg" 
                    alt="Коммунальная техника"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Коммунальная техника</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Мусоровозы, снегоуборочная техника, автогрейдеры, поливальные машины и другая техника для коммунальных служб
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Оставить заявку на лизинг спецтехники</h2>
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
                    <label htmlFor="equipment" className="block font-medium">
                      Тип техники *
                    </label>
                    <select
                      id="equipment"
                      value={formData.equipment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
                    >
                      <option value="">Выберите тип техники</option>
                      <option value="construction">Строительная техника</option>
                      <option value="agricultural">Сельскохозяйственная техника</option>
                      <option value="municipal">Коммунальная техника</option>
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
                      placeholder="Укажите интересующую вас модель техники, предполагаемый срок лизинга и другие детали"
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