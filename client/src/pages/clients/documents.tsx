
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/main-layout";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Download } from "lucide-react";

const DocumentCard = ({ title, link }: { title: string, link: string }) => {
  return (
    <div className="bg-card/50 p-4 rounded-lg border border-border hover:bg-card/70 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-primary mr-3" />
          <h3 className="text-sm font-medium">{title}</h3>
        </div>
        <Button variant="outline" size="sm" asChild className="gap-2 ml-4">
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Download className="h-3 w-3" /> Скачать
          </a>
        </Button>
      </div>
    </div>
  );
};

export default function DocumentsPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inn: '',
    leaseTerm: '3',
    propertyValue: [100000],
    downPayment: [0],
    comment: '',
    agreementChecked: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreementChecked) {
      alert('Необходимо согласие на обработку персональных данных');
      return;
    }

    try {
      const response = await fetch('/api/send-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          serviceType: 'Документы и консультация',
          comment: `ИНН: ${formData.inn}, Срок лизинга: ${formData.leaseTerm} лет, Стоимость имущества: ${formData.propertyValue[0]} ₽, Авансовый платёж: ${formData.downPayment[0]}%, Комментарий: ${formData.comment}`,
        }),
      });

      if (response.ok) {
        alert('Заявка отправлена успешно!');
        setFormData({
          name: '',
          phone: '',
          email: '',
          inn: '',
          leaseTerm: '3',
          propertyValue: [100000],
          downPayment: [0],
          comment: '',
          agreementChecked: false
        });
      } else {
        const error = await response.json();
        alert(error.message || 'Произошла ошибка при отправке заявки');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Произошла ошибка при отправке заявки');
    }
  };

  const monthlyPayment = () => {
    const value = formData.propertyValue[0];
    const term = parseInt(formData.leaseTerm) * 12;
    const rate = 0.15 / 12; // 15% годовых
    const downPaymentAmount = value * (formData.downPayment[0] / 100);
    const financeAmount = value - downPaymentAmount;
    
    if (financeAmount <= 0) return 0;
    
    const payment = (financeAmount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    return Math.round(payment);
  };

  const financeAmount = () => {
    const value = formData.propertyValue[0];
    const downPaymentAmount = value * (formData.downPayment[0] / 100);
    return value - downPaymentAmount;
  };

  const normativeDocuments = [
    {
      title: 'Конвенция УНИДРУА от 28.05.1988. (ФЗ от 08.02.1998 №16-ФЗ)',
      link: 'https://investl.ru/upload/iblock/4ef/be0z5j5runmimzkxvh2yo3wbe8yd6yud.pdf'
    },
    {
      title: 'ФЗ №164 О ФИНАНСОВОЙ АРЕНДЕ. 11.12.1998 г.',
      link: 'https://investl.ru/upload/iblock/d75/ffuol0737ay7jbxy4sq7h62qby702coi.pdf'
    },
    {
      title: 'ГК РФ Раздел IV. Отдельные виды обязательств.$6 Финансовая аренда (лизинг 22.12.1995 г.)',
      link: 'https://investl.ru/upload/iblock/d97/u7ta89hiy92fzvhg7knc3lfhlm37gzk5.pdf'
    }
  ];

  const generalConditions = [
    {
      title: 'Общие условия финансовой аренды (лизинга) оборудования (ред. от 14.07.2022)',
      link: 'https://investl.ru/upload/iblock/600/mxi076apq65icew2937nsfdy526aucpp.pdf'
    },
    {
      title: 'Общие условия финансовой аренды (лизинга) недвижимого имущества (ред. от 14.07.2022)',
      link: 'https://investl.ru/upload/iblock/511/8faj590zk9q63s6kaknl1f7rufxr73ka.pdf'
    },
    {
      title: 'Общие условия финансовой аренды (лизинга) автотранспорта, спецтехники (ред. от 14.07.2022)',
      link: 'https://investl.ru/upload/iblock/230/swvtnk4xyxejgrw5y8t12ailzw592v5c.pdf'
    },
    {
      title: 'Общие условия лизинга оборудования 2021 год',
      link: 'https://investl.ru/upload/iblock/ad0/vc0hczyy5up0cxot04kotpjdaf4chhma.pdf'
    },
    {
      title: 'Общие условия лизинга недвижимого имущества 2021 год',
      link: 'https://investl.ru/upload/iblock/62c/zd52rt93e3fio7tprqbuoekdcc8u5x90.pdf'
    },
    {
      title: 'Общие условия лизинга автотранспорта спецтехники 2021 год',
      link: 'https://investl.ru/upload/iblock/75f/k27bpctlh34gdticj6nx77s35mna0b2o.pdf'
    }
  ];

  const privacyPolicy = [
    {
      title: 'Политика обработки персональных данных',
      link: 'https://investl.ru/upload/iblock/063/77j17jnlutk5mjsev6mjlg33xrb7y25j.pdf'
    }
  ];

  return (
    <MainLayout>
      <section className="py-20 relative">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Документы</h1>
            <p className="text-muted-foreground text-lg">
              Нормативные документы и общие условия лизинга
            </p>
          </div>
          
          {/* Нормативные документы */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold mb-6">Нормативные документы</h2>
            <div className="grid gap-4">
              {normativeDocuments.map((doc, index) => (
                <DocumentCard key={index} title={doc.title} link={doc.link} />
              ))}
            </div>
          </div>

          {/* Общие условия лизинга */}
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-2xl font-semibold mb-6">Общие условия лизинга</h2>
            <div className="grid gap-4">
              {generalConditions.map((doc, index) => (
                <DocumentCard key={index} title={doc.title} link={doc.link} />
              ))}
            </div>
          </div>

          {/* Политика обработки персональных данных */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-semibold mb-6">Политика обработки персональных данных</h2>
            <div className="grid gap-4">
              {privacyPolicy.map((doc, index) => (
                <DocumentCard key={index} title={doc.title} link={doc.link} />
              ))}
            </div>
          </div>

          {/* Форма заявки */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-card/30 p-8 rounded-lg border">
              <h2 className="text-2xl font-semibold mb-8 text-center">Оставьте заявку</h2>
              
              {/* Этапы */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                  <h3 className="font-semibold mb-2">Оставьте заявку</h3>
                  <p className="text-sm text-muted-foreground">Мы свяжемся с Вами в течение часа</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                  <h3 className="font-semibold mb-2">Согласуем условия сделки</h3>
                  <p className="text-sm text-muted-foreground">И проверим документы</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                  <h3 className="font-semibold mb-2">Заключим договор</h3>
                  <p className="text-sm text-muted-foreground">И передадим Вам имущество в пользование</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name">Ваше имя *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Электронная почта *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="inn">ИНН</Label>
                    <Input
                      id="inn"
                      value={formData.inn}
                      onChange={(e) => setFormData(prev => ({ ...prev, inn: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="leaseTerm">Желаемый срок лизинга</Label>
                    <Select value={formData.leaseTerm} onValueChange={(value) => setFormData(prev => ({ ...prev, leaseTerm: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите срок" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 год</SelectItem>
                        <SelectItem value="3">3 года</SelectItem>
                        <SelectItem value="5">5 лет</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Стоимость имущества: {formData.propertyValue[0].toLocaleString()} ₽</Label>
                    <Slider
                      value={formData.propertyValue}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, propertyValue: value }))}
                      max={300000000}
                      min={100000}
                      step={50000}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>100 000 ₽</span>
                      <span>300 000 000 ₽</span>
                    </div>
                  </div>

                  <div>
                    <Label>Авансовый платёж: {formData.downPayment[0]}%</Label>
                    <Slider
                      value={formData.downPayment}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, downPayment: value }))}
                      max={49}
                      min={0}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0%</span>
                      <span>49%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-card p-6 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Расчёт лизинга</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Ставка удорожания:</span>
                        <span className="font-semibold">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Сроком на:</span>
                        <span className="font-semibold">{formData.leaseTerm} {formData.leaseTerm === '1' ? 'год' : formData.leaseTerm === '5' ? 'лет' : 'года'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Сумма финансирования:</span>
                        <span className="font-semibold">{financeAmount().toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span>Ежемесячный платёж:</span>
                        <span className="font-semibold text-lg">{monthlyPayment().toLocaleString()} ₽</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Расчёты носят ознакомительный характер и не являются офертой
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="comment">Комментарий</Label>
                    <Textarea
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreement"
                      checked={formData.agreementChecked}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agreementChecked: checked as boolean }))}
                    />
                    <Label htmlFor="agreement" className="text-sm leading-relaxed">
                      Согласие на обработку{' '}
                      <a 
                        href="https://investl.ru/upload/iblock/063/77j17jnlutk5mjsev6mjlg33xrb7y25j.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        персональных данных
                      </a>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Оставить заявку
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * - обязательное поле
                  </p>
                </div>
              </form>
            </div>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
