import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import React, { useState } from 'react';

export default function OborudovaniePage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    equipment: '',
    comment: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Имя обязательно';
    if (!formData.phone) newErrors.phone = 'Телефон обязателен';
    if (!formData.email) newErrors.email = 'Email обязателен';
    if (!formData.equipment) newErrors.equipment = 'Тип оборудования обязателен';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch('/api/send-email', { // Assuming you have an API route for sending emails
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, to: 'inv.lizing@yandex.ru' }),
        });

        if (response.ok) {
          alert('Заявка успешно отправлена!');
          setFormData({
            name: '',
            phone: '',
            email: '',
            equipment: '',
            comment: '',
          });
        } else {
          alert('Ошибка при отправке заявки. Попробуйте позже.');
        }
      } catch (error) {
        console.error('Error sending email:', error);
        alert('Произошла ошибка при отправке заявки.');
      }
    }
  };

  return (
    <MainLayout>
      <main className="flex-1">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-10"></div>
          <div className="absolute inset-0 bg-[url('/bg-equipment.jpg')] bg-cover bg-center opacity-15"></div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">Лизинг оборудования</h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Мы предлагаем выгодные условия лизинга любого производственного, медицинского и торгового оборудования.
                Компания "Инвест-Лизинг" поможет вам модернизировать производство без значительных единовременных затрат.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Преимущества лизинга оборудования</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Низкие начальные вложения</h3>
                <p className="text-muted-foreground">
                  Первоначальный взнос от 10%, что позволяет начать использовать оборудование без существенных капитальных затрат
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Гибкий график платежей</h3>
                <p className="text-muted-foreground">
                  Возможность настроить график платежей под сезонность бизнеса или особенности производственного цикла
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Налоговые льготы</h3>
                <p className="text-muted-foreground">
                  Лизинговые платежи в полном объеме относятся на себестоимость, а НДС к вычету
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ускоренная амортизация</h3>
                <p className="text-muted-foreground">
                  Возможность применения коэффициента ускоренной амортизации до 3, что позволяет снизить налог на имущество
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Простота получения</h3>
                <p className="text-muted-foreground">
                  Упрощенная процедура оформления по сравнению с кредитом и минимальный пакет документов
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Сервисное обслуживание</h3>
                <p className="text-muted-foreground">
                  Возможность включения в договор условий по обслуживанию и ремонту оборудования
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Виды оборудования для лизинга</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="rounded-xl overflow-hidden group">
                <div className="h-64 relative">
                  <img 
                    src="/manufacturing-equipment.jpg" 
                    alt="Производственное оборудование"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Производственное оборудование</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Станки, производственные линии, конвейеры, промышленное оборудование для любых отраслей
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
                    src="/medical-equipment.jpg" 
                    alt="Медицинское оборудование"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Медицинское оборудование</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Диагностическое, лабораторное, реабилитационное и другое оборудование для здравоохранения
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
                    src="/retail-equipment.jpg" 
                    alt="Торговое оборудование"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Торговое оборудование</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Холодильное, кассовое, выставочное оборудование, POS-системы для розничной торговли
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Оставить заявку на лизинг оборудования</h2>
              <p className="text-center text-muted-foreground mb-8">
                Заполните форму ниже, и наш специалист свяжется с вами в ближайшее время для консультации и расчета лизинговых платежей
              </p>

              <div className="p-8 rounded-lg glass backdrop-blur-sm bg-background/30">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block font-medium">
                        Ваше имя
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-border'} rounded-md bg-background/50 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-primary/50'}`}
                        placeholder="Иван Иванов"
                      />
                      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block font-medium">
                        Телефон
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-border'} rounded-md bg-background/50 focus:outline-none focus:ring-2 ${errors.phone ? 'focus:ring-red-500' : 'focus:ring-primary/50'}`}
                        placeholder="+7 (___) ___-__-__"
                      />
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-border'} rounded-md bg-background/50 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-primary/50'}`}
                      placeholder="example@company.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="equipment" className="block font-medium">
                      Тип оборудования
                    </label>
                    <select
                      id="equipment"
                      value={formData.equipment}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${errors.equipment ? 'border-red-500' : 'border-border'} rounded-md bg-background/50 focus:outline-none focus:ring-2 ${errors.equipment ? 'focus:ring-red-500' : 'focus:ring-primary/50'}`}
                    >
                      <option value="">Выберите тип оборудования</option>
                      <option value="manufacturing">Производственное оборудование</option>
                      <option value="medical">Медицинское оборудование</option>
                      <option value="retail">Торговое оборудование</option>
                      <option value="other">Другое (укажите в комментарии)</option>
                    </select>
                    {errors.equipment && <p className="text-red-500 text-sm">{errors.equipment}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="comment" className="block font-medium">
                      Комментарий
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={formData.comment}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Укажите модель оборудования, предполагаемый срок лизинга и другие детали"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" className="w-full">
                      Отправить заявку
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