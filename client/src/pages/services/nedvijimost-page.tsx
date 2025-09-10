import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react"; // Import useState

export default function NedvijimostPage() {
  const [formData, setFormData] = useState({ // State for form data
    name: '',
    phone: '',
    email: '',
    property: '',
    comment: ''
  });
  const [errors, setErrors] = useState({}); // State for form errors

  const handleChange = (e) => { // Handle input changes
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => { // Handle form submission
    e.preventDefault(); // Prevent default form submission

    const newErrors = {}; // Initialize errors object
    // Basic validation
    if (!formData.name.trim()) {
      newErrors.name = 'Поле "Имя" обязательно';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Поле "Телефон" обязательно';
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Поле "Email" обязательно и должно быть корректным';
    }
    if (!formData.property) {
      newErrors.property = 'Выберите "Тип недвижимости"';
    }

    setErrors(newErrors); // Set errors

    if (Object.keys(newErrors).length === 0) { // If no errors
      try {
        const response = await fetch('/api/send-email', { // Send email to backend
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert('Заявка успешно отправлена!'); // Show success message
          setFormData({ // Reset form
            name: '',
            phone: '',
            email: '',
            property: '',
            comment: ''
          });
        } else {
          alert('Ошибка при отправке заявки. Попробуйте позже.'); // Show error message
        }
      } catch (error) {
        console.error('Error sending email:', error); // Log error
        alert('Произошла ошибка при отправке заявки.'); // Show generic error message
      }
    }
  };


  return (
    <MainLayout>
      <main className="flex-1">
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-10"></div>
          <div className="absolute inset-0 bg-[url('/bg-realestate.jpg')] bg-cover bg-center opacity-15"></div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-8">Лизинг недвижимости</h1>
              <p className="text-xl mb-8 text-muted-foreground">
                Компания "Инвест-Лизинг" предлагает выгодные условия лизинга коммерческой недвижимости. 
                Мы поможем вам приобрести офисные, торговые, складские и производственные помещения на оптимальных условиях.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Преимущества лизинга недвижимости</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Доступный первый взнос</h3>
                <p className="text-muted-foreground">
                  От 20% стоимости объекта недвижимости, что существенно ниже, чем при ипотечном кредитовании
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Длительный срок</h3>
                <p className="text-muted-foreground">
                  Срок договора лизинга до 10 лет с возможностью последующего выкупа недвижимости
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Налоговые преимущества</h3>
                <p className="text-muted-foreground">
                  Лизинговые платежи в полном объеме относятся на затраты, уменьшая налогооблагаемую базу
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Экономия на НДС</h3>
                <p className="text-muted-foreground">
                  НДС, включенный в лизинговые платежи, принимается к вычету, что невозможно при обычной покупке
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Сохранение ликвидности</h3>
                <p className="text-muted-foreground">
                  Возможность использовать недвижимость без значительного оттока денежных средств из бизнеса
                </p>
              </div>

              <div className="p-6 rounded-lg glass backdrop-blur-sm bg-background/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-full bg-[#b9a046]/20 flex items-center justify-center mb-4">
                  <Check className="h-6 w-6 text-[#b9a046]" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Упрощенная процедура</h3>
                <p className="text-muted-foreground">
                  Более простая процедура оформления по сравнению с банковским кредитованием
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Виды недвижимости для лизинга</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="rounded-xl overflow-hidden group">
                <div className="h-64 relative">
                  <img 
                    src="/office-realestate.jpg" 
                    alt="Офисная недвижимость"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Офисная недвижимость</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Офисные здания и помещения различной площади в бизнес-центрах и отдельно стоящих зданиях
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
                    src="/retail-realestate.jpg" 
                    alt="Торговая недвижимость"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Торговая недвижимость</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Помещения в торговых центрах, отдельно стоящие магазины, торговые павильоны и другие объекты
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
                    src="/warehouse-realestate.jpg" 
                    alt="Производственная и складская недвижимость"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Производственная и складская недвижимость</h3>
                  </div>
                </div>
                <div className="p-6 glass backdrop-blur-sm bg-background/30">
                  <p className="text-muted-foreground mb-4">
                    Складские комплексы, логистические терминалы, производственные помещения и промышленные здания
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
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Оставить заявку на лизинг недвижимости</h2>
              <p className="text-center text-muted-foreground mb-8">
                Заполните форму ниже, и наш специалист свяжется с вами в ближайшее время для консультации и расчета лизинговых платежей
              </p>

              <div className="p-8 rounded-lg glass backdrop-blur-sm bg-background/30">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="block font-medium">
                        Ваше имя
                      </label>
                      <input
                        id="name"
                        type="text"
                        className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-border'} rounded-md bg-background/50 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500' : 'focus:ring-primary/50'}`}
                        placeholder="Иван Иванов"
                        value={formData.name}
                        onChange={handleChange}
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
                        className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-border'} rounded-md bg-background/50 focus:outline-none focus:ring-2 ${errors.phone ? 'focus:ring-red-500' : 'focus:ring-primary/50'}`}
                        placeholder="+7 (___) ___-__-__"
                        value={formData.phone}
                        onChange={handleChange}
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
                      className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-border'} rounded-md bg-background/50 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500' : 'focus:ring-primary/50'}`}
                      placeholder="example@company.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="property" className="block font-medium">
                      Тип недвижимости
                    </label>
                    <select
                      id="property"
                      className={`w-full px-4 py-2 border ${errors.property ? 'border-red-500' : 'border-border'} rounded-md bg-background/50 focus:outline-none focus:ring-2 ${errors.property ? 'focus:ring-red-500' : 'focus:ring-primary/50'}`}
                      value={formData.property}
                      onChange={handleChange}
                    >
                      <option value="">Выберите тип недвижимости</option>
                      <option value="office">Офисная недвижимость</option>
                      <option value="retail">Торговая недвижимость</option>
                      <option value="warehouse">Складская недвижимость</option>
                      <option value="industrial">Производственная недвижимость</option>
                      <option value="other">Другое (укажите в комментарии)</option>
                    </select>
                    {errors.property && <p className="text-red-500 text-sm">{errors.property}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="comment" className="block font-medium">
                      Комментарий
                    </label>
                    <textarea
                      id="comment"
                      rows={4}
                      className="w-full px-4 py-2 border border-border rounded-md bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Укажите площадь, местоположение и другие параметры интересующей вас недвижимости"
                      value={formData.comment}
                      onChange={handleChange}
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