import { Card } from "@/components/ui/card";
import { Shield, Award, Clock, Zap } from "lucide-react";

type AdvantageProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const Advantage = ({ title, description, icon }: AdvantageProps) => {
  return (
    <Card className="glass backdrop-blur-lg p-6 bg-background/30 border-border group hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col h-full">
        <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-muted-foreground text-sm flex-grow">{description}</p>
      </div>
    </Card>
  );
};

export const AdvantagesSection = () => {
  const advantages = [
    {
      title: "Надежность",
      description: "Наш учредитель надежный региональный банк.",
      icon: <Shield className="h-10 w-10" />
    },
    {
      title: "Профессионализм",
      description: "При любой сделке возникает масса вопросов: как правильно организовать процесс сотрудничества, что можно взять в лизинг, как оформить договор. Наши специалисты тщательно проанализируют Вашу задачу и смогут предложить Вам оптимальные решения.",
      icon: <Award className="h-10 w-10" />
    },
    {
      title: "Оперативность",
      description: "Решение по сделке за один день!",
      icon: <Clock className="h-10 w-10" />
    },
    {
      title: "Привлекательность",
      description: "Оптимальные условия финансирования.",
      icon: <Zap className="h-10 w-10" />
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Преимущества работы с нами</h2>
          <p className="text-muted-foreground text-lg">
            Наша компания предлагает ряд преимуществ, которые делают сотрудничество с нами выгодным и комфортным
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((advantage, index) => (
            <Advantage 
              key={index} 
              title={advantage.title} 
              description={advantage.description} 
              icon={advantage.icon} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};