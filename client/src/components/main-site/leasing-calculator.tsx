import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Calculator } from "lucide-react";

export const LeasingCalculator = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inn, setInn] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Leasing parameters
  const [amount, setAmount] = useState(5000000);
  const [leaseTerm, setLeaseTerm] = useState(36); // months
  const [downPayment, setDownPayment] = useState(15); // percentage
  
  // Calculated values
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [financeAmount, setFinanceAmount] = useState(0);
  const [appreciationRate, setAppreciationRate] = useState(15); // percentage
  
  // Calculate lease payments
  useEffect(() => {
    const calcFinanceAmount = amount * (1 - downPayment / 100);
    setFinanceAmount(calcFinanceAmount);
    
    // Simple calculation for demonstration purposes
    const totalPayment = calcFinanceAmount * (1 + appreciationRate / 100);
    const monthly = totalPayment / leaseTerm;
    setMonthlyPayment(Math.round(monthly));
  }, [amount, leaseTerm, downPayment, appreciationRate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Заявка успешно отправлена!");
      // Reset form
      setName("");
      setPhone("");
      setEmail("");
      setInn("");
      setComment("");
    }, 1500);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ru-RU").format(value);
  };

  return (
    <section id="calculator" className="py-20 bg-background/50 relative overflow-hidden">
      {/* Subtle background effects for VisionOS look */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-primary opacity-10 blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-center mb-16">
          <div className="text-center max-w-2xl">
            <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Рассчитайте лизинг</h2>
            <p className="text-muted-foreground text-lg">
              Узнайте примерный ежемесячный платеж и оставьте заявку на лизинг
            </p>
          </div>
        </div>
        
        <Card className="glass backdrop-blur-lg p-6 md:p-8 rounded-xl bg-background/30 border-border shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Calculator Section */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Параметры лизинга</h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="amount">Стоимость имущества, ₽</Label>
                      <span className="text-sm font-medium">{formatCurrency(amount)} ₽</span>
                    </div>
                    <Slider 
                      id="amount"
                      value={[amount]} 
                      min={100000} 
                      max={100000000} 
                      step={100000}
                      onValueChange={(value) => setAmount(value[0])}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>100 000 ₽</span>
                      <span>100 000 000 ₽</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="term">Желаемый срок лизинга, мес</Label>
                      <span className="text-sm font-medium">{leaseTerm} мес</span>
                    </div>
                    <Slider 
                      id="term"
                      value={[leaseTerm]} 
                      min={12} 
                      max={60} 
                      step={12}
                      onValueChange={(value) => setLeaseTerm(value[0])}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>1 год</span>
                      <span>5 лет</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="downPayment">Авансовый платёж, %</Label>
                      <span className="text-sm font-medium">{downPayment}%</span>
                    </div>
                    <Slider 
                      id="downPayment"
                      value={[downPayment]} 
                      min={0} 
                      max={49} 
                      step={1}
                      onValueChange={(value) => setDownPayment(value[0])}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>49%</span>
                    </div>
                  </div>
                  
                  <div className="p-6 glass backdrop-blur-sm bg-background/20 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Ставка удорожания</p>
                        <p className="text-2xl font-bold text-white">{appreciationRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Сроком на</p>
                        <p className="text-2xl font-bold text-white">{leaseTerm / 12} {leaseTerm / 12 === 1 ? 'год' : (leaseTerm / 12 < 5 ? 'года' : 'лет')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Сумма финансирования</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(financeAmount)} ₽</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Ежемесячный платёж</p>
                        <p className="text-2xl font-bold text-white">{formatCurrency(monthlyPayment)} ₽</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form Section */}
              <div>
                <h3 className="text-xl font-semibold mb-6">Заполните форму для подачи заявки</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иван Иванов" 
                      required
                      className="mt-1 bg-background border-border"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input 
                      id="phone" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (900) 123-45-67" 
                      required
                      className="mt-1 bg-background border-border"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Электронная почта</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@mail.ru" 
                      required
                      className="mt-1 bg-background border-border"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="inn">ИНН</Label>
                    <Input 
                      id="inn" 
                      value={inn} 
                      onChange={(e) => setInn(e.target.value)}
                      placeholder="1234567890"
                      className="mt-1 bg-background border-border"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="comment">Комментарий</Label>
                    <Textarea 
                      id="comment" 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Дополнительная информация"
                      className="mt-1 bg-background border-border"
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-4"
                    disabled={isSubmitting}
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Отправка...
                      </>
                    ) : (
                      'Оставить заявку'
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Нажимая кнопку "Оставить заявку", вы соглашаетесь с условиями обработки персональных данных
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
};