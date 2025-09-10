
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Send, Upload } from "lucide-react";

const cities = [
  'Краснодар',
  'Нижний Новгород', 
  'Санкт-Петербург',
  'Тамбов',
  'Тольятти',
  'Тюмень',
  'Ульяновск',
  'Уфа',
  'Челябинск'
];

export default function VacanciesPage() {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [applicationForm, setApplicationForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    resume: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationForm(prev => ({
        ...prev,
        resume: e.target.files![0]
      }));
    }
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationForm.fullName || !applicationForm.phone || !applicationForm.email || !applicationForm.resume) {
      alert('Пожалуйста, заполните все обязательные поля и прикрепите резюме');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', applicationForm.fullName);
      formData.append('phone', applicationForm.phone);
      formData.append('email', applicationForm.email);
      formData.append('city', selectedCity);
      formData.append('position', 'Менеджер по продажам');
      formData.append('resume', applicationForm.resume);

      const response = await fetch('/api/send-resume', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        alert('Ваше резюме успешно отправлено!');
        setApplicationForm({
          fullName: '',
          phone: '',
          email: '',
          resume: null
        });
        setIsDialogOpen(false);
      } else {
        alert('Произошла ошибка при отправке резюме. Пожалуйста, попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Error sending resume:', error);
      alert('Произошла ошибка при отправке резюме. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-20 relative">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Вакансии</h1>
            <p className="text-muted-foreground text-lg">
              Присоединяйтесь к команде «ИНВЕСТ-лизинг»
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {!selectedCity ? (
              <div>
                <h2 className="text-2xl font-bold mb-8 text-center">Выберите город</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cities.map((city) => (
                    <Card 
                      key={city} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedCity(city)}
                    >
                      <CardContent className="p-6 text-center">
                        <MapPin className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <h3 className="text-lg font-semibold">{city}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Вакансии в городе {selectedCity}</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCity('')}
                  >
                    Выбрать другой город
                  </Button>
                </div>

                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Менеджер по продажам</span>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button>
                              <Send className="mr-2 h-4 w-4" />
                              Откликнуться на вакансию
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Отклик на вакансию</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmitApplication} className="space-y-4">
                              <div>
                                <Label htmlFor="fullName">ФИО *</Label>
                                <Input
                                  id="fullName"
                                  value={applicationForm.fullName}
                                  onChange={(e) => setApplicationForm(prev => ({
                                    ...prev,
                                    fullName: e.target.value
                                  }))}
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="phone">Телефон *</Label>
                                <Input
                                  id="phone"
                                  type="tel"
                                  value={applicationForm.phone}
                                  onChange={(e) => setApplicationForm(prev => ({
                                    ...prev,
                                    phone: e.target.value
                                  }))}
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={applicationForm.email}
                                  onChange={(e) => setApplicationForm(prev => ({
                                    ...prev,
                                    email: e.target.value
                                  }))}
                                  required
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="resume">Резюме *</Label>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    id="resume"
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    required
                                    className="hidden"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => document.getElementById('resume')?.click()}
                                    className="w-full"
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {applicationForm.resume ? applicationForm.resume.name : 'Выберите файл'}
                                  </Button>
                                </div>
                              </div>
                              
                              <Button 
                                type="submit" 
                                className="w-full"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? 'Отправка...' : 'Отправить резюме'}
                              </Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Требования:</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Высшее образование</li>
                            <li>Опыт успешных продаж в сфере финансовых услуг от 1 года</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Обязанности:</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Активный поиск и привлечение потенциальных клиентов</li>
                            <li>Сбор первичных документов по клиенту</li>
                            <li>Подготовка и заключение договоров: финансовой аренды (лизинга), купли-продажи, поручительства и т.п.</li>
                            <li>Контроль исполнения договора до полного погашения всех обязательств</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Условия:</h4>
                          <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li>Полная занятость, полный день</li>
                            <li>График работы: пн. - пт. с 8:00 до 17:00</li>
                            <li>Полный социальный пакет</li>
                            <li>Официальное трудоустройство</li>
                            <li>Корпоративное обучение</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
