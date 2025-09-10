import { useState } from "react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SimpleRussiaMap } from "./simple-russia-map";

interface Region {
  id: string;
  code: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

import { MapPin, Phone, Mail, Clock } from "lucide-react";

export function InteractiveMap() {
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const regions: Region[] = [
    {
      id: "krasnodar",
      code: "RU-KDA",
      name: "Краснодарский край",
      city: "Краснодар",
      address: "г. Краснодар ул. Российская д. 388 офис 5",
      phone: "+7 (919) 110-70-55",
      email: "info@investl.ru"
    },
    {
      id: "leningrad",
      code: "RU-LEN",
      name: "Ленинградская область",
      city: "Санкт-Петербург",
      address: "г. Санкт-Петербург, пр. Энергетиков, д. 4к1, БЦ Амбер Холл, оф. 1206",
      phone: "+7 (921) 951-20-70",
      email: "info@investl.ru"
    },
    {
      id: "nn",
      code: "RU-NIZ",
      name: "Нижегородская область",
      city: "Нижний Новгород",
      address: "603040, г. Нижний Новгород, проспект Союзный, д. 45, офис 11 (этаж 4), Бизнес центр \"Володарский\"",
      phone: "+7 (919) 110-70-66",
      email: "info@investl.ru"
    },
    {
      id: "tambov",
      code: "RU-TAM",
      name: "Тамбовская область",
      city: "Тамбов",
      address: "г. Тамбов, улица Мичуринская 146, оф 7",
      phone: "+7 (919) 110-70-25",
      email: "info@investl.ru"
    },
    {
      id: "samara",
      code: "RU-SAM",
      name: "Самарская область",
      city: "Тольятти",
      address: "445030, Самарская обл., г. Тольятти, ул. 70 лет Октября, д.31А",
      phone: "+7 (919) 110-70-15",
      email: "info@investl.ru"
    },
    {
      id: "tyumen",
      code: "RU-TYU",
      name: "Тюменская область",
      city: "Тюмень",
      address: "625007, г. Тюмень, ул. 30 лет Победы, д. 38А, офис 53",
      phone: "+7 (3452) 39-34-83",
      email: "info@investl.ru"
    },
    {
      id: "ulyanovsk",
      code: "RU-ULY",
      name: "Ульяновская область",
      city: "Ульяновск",
      address: "432072, г. Ульяновск, проспект Туполева, д. 31, стр. 1 (этаж 1), Бизнес центр \"Взлетный\"",
      phone: "+7 (982) 370-04-26",
      email: "info@investl.ru"
    },
    {
      id: "bashkortostan",
      code: "RU-BA",
      name: "Республика Башкортостан",
      city: "Уфа",
      address: "Республика Башкортостан, г. Уфа, ул. Кирова, д.128, корпус 2, пом.4",
      phone: "+7 (919) 110-70-06",
      email: "info@investl.ru"
    },
    {
      id: "chelyabinsk",
      code: "RU-CHE",
      name: "Челябинская область",
      city: "Челябинск",
      address: "454084, г. Челябинск, проспект Победы, д. 147-A, 1 этаж",
      phone: "+7 (351) 791-06-46",
      email: "info@investl.ru"
    }
  ];

  const handleSelectRegion = (region: Region) => {
    setSelectedRegion(region);
    setIsOpen(false);
  };

  const defaultRegion = regions.find(r => r.id === "krasnodar") || regions[0];

  return (
    <div className="flex flex-col gap-4 items-start">
      <div className="w-full glass p-6 rounded-xl text-center relative overflow-hidden">
        <h3 className="text-xl font-semibold mb-6">Наши филиалы на карте России</h3>
        
        {/* Верхние блоки в ряд */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Выпадающий список и контактная информация - слева */}
          <div className="glass backdrop-blur-sm bg-background/30 rounded-lg p-4">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-background/50 mb-4">
                  {selectedRegion ? selectedRegion.city : defaultRegion.city}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="max-h-[300px] overflow-auto">
                  {regions.map((region) => (
                    <Button
                      key={region.id}
                      variant="ghost"
                      className="w-full justify-start rounded-none"
                      onClick={() => handleSelectRegion(region)}
                    >
                      {region.city}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {selectedRegion ? selectedRegion.address : defaultRegion.address}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {selectedRegion ? selectedRegion.phone : defaultRegion.phone}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {selectedRegion ? selectedRegion.email : defaultRegion.email}
                </span>
              </div>
            </div>
          </div>
          
          {/* Время работы - справа */}
          <div className="glass backdrop-blur-sm bg-background/30 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center text-left">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              Время работы
            </h4>
            <div className="flex justify-between text-sm mb-2">
              <span>Понедельник - Пятница</span>
              <span className="text-muted-foreground">9:00 - 18:00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Суббота - Воскресенье</span>
              <span className="text-muted-foreground">Выходной</span>
            </div>
          </div>
        </div>
        
        {/* Карта России */}
        <div className="h-[400px] glass backdrop-blur-sm bg-background/30 rounded-lg overflow-hidden p-6">
          <div style={{ maxWidth: "100%", height: "100%", overflow: "hidden" }}>
            <SimpleRussiaMap 
              regions={regions} 
              onRegionSelect={handleSelectRegion} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}