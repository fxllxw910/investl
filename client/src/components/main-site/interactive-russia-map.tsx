import React, { useEffect, useState, useRef } from 'react';
import './russia-map.css';

// Типы для наших данных
interface Branch {
  id: number;
  city: string;
  regionCode: string;
  regionName: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
}

interface Region {
  code: string;
  name: string;
  hasBranch: boolean;
}

// Компонент интерактивной карты России
const InteractiveRussiaMap: React.FC = () => {
  // Список регионов, где есть филиалы (придуманные примеры)
  const regionsWithBranches = [
    'RU-MOW', // Москва
    'RU-SPE', // Санкт-Петербург
    'RU-KDA', // Краснодарский край
    'RU-NIZ', // Нижегородская область
    'RU-SVE', // Свердловская область 
    'RU-NVS', // Новосибирская область
    'RU-KHM', // Ханты-Мансийский АО
    'RU-PRI', // Приморский край
  ];

  // Данные о филиалах
  const branchesData: Branch[] = [
    {
      id: 1,
      city: 'Москва',
      regionCode: 'RU-MOW',
      regionName: 'г. Москва',
      address: 'ул. Тверская, 15, офис 301',
      phone: '+7 (495) 123-45-67',
      email: 'moscow@investlease.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 2,
      city: 'Санкт-Петербург',
      regionCode: 'RU-SPE',
      regionName: 'г. Санкт-Петербург',
      address: 'Невский проспект, 100, офис 215',
      phone: '+7 (812) 765-43-21',
      email: 'spb@investlease.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 3,
      city: 'Краснодар',
      regionCode: 'RU-KDA',
      regionName: 'Краснодарский край',
      address: 'ул. Красная, 55, офис 102',
      phone: '+7 (861) 234-56-78',
      email: 'krasnodar@investlease.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 4,
      city: 'Нижний Новгород',
      regionCode: 'RU-NIZ',
      regionName: 'Нижегородская область',
      address: 'ул. Минина, 25, офис 304',
      phone: '+7 (831) 345-67-89',
      email: 'nnovgorod@investlease.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 5,
      city: 'Екатеринбург',
      regionCode: 'RU-SVE',
      regionName: 'Свердловская область',
      address: 'ул. Ленина, 40, офис 505',
      phone: '+7 (343) 456-78-90',
      email: 'ekb@investlease.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 6,
      city: 'Новосибирск',
      regionCode: 'RU-NVS',
      regionName: 'Новосибирская область',
      address: 'Красный проспект, 70, офис 210',
      phone: '+7 (383) 567-89-01',
      email: 'nsk@investlease.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 7,
      city: 'Сургут',
      regionCode: 'RU-KHM',
      regionName: 'Ханты-Мансийский АО',
      address: 'ул. Университетская, 15, офис 112',
      phone: '+7 (3462) 78-90-12',
      email: 'surgut@investlease.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 8,
      city: 'Владивосток',
      regionCode: 'RU-PRI',
      regionName: 'Приморский край',
      address: 'ул. Светланская, 85, офис 408',
      phone: '+7 (423) 890-12-34',
      email: 'vladivostok@investlease.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
  ];

  // Состояния компонента
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({ title: '', regionCode: '' });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  const mapRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Эффект для инициализации интерактивности карты
  useEffect(() => {
    if (!mapRef.current) return;

    const svgDocument = mapRef.current;
    const regions = svgDocument.querySelectorAll('.region');

    regions.forEach((region) => {
      const regionId = region.getAttribute('id');
      
      // Помечаем регионы с филиалами
      if (regionId && regionsWithBranches.includes(regionId)) {
        region.classList.add('available');
      }

      // Добавляем обработчики событий
      region.addEventListener('mouseenter', handleRegionMouseEnter);
      region.addEventListener('mouseleave', handleRegionMouseLeave);
      region.addEventListener('mousemove', handleRegionMouseMove);
      region.addEventListener('click', handleRegionClick);
    });

    // Очистка обработчиков при размонтировании
    return () => {
      regions.forEach((region) => {
        region.removeEventListener('mouseenter', handleRegionMouseEnter);
        region.removeEventListener('mouseleave', handleRegionMouseLeave);
        region.removeEventListener('mousemove', handleRegionMouseMove);
        region.removeEventListener('click', handleRegionClick);
      });
    };
  }, []);

  // Обработчики событий для регионов
  const handleRegionMouseEnter = (e: Event) => {
    const target = e.target as SVGPathElement;
    const regionId = target.getAttribute('id');
    const regionTitle = target.getAttribute('data-title') || regionId || '';
    
    if (regionId) {
      setTooltipContent({
        title: regionTitle,
        regionCode: regionId
      });
      setShowTooltip(true);
    }
  };

  const handleRegionMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleRegionMouseMove = (e: Event) => {
    if (!mapRef.current) return;
    
    const mouseEvent = e as MouseEvent;
    const svgRect = mapRef.current.getBoundingClientRect();
    
    // Рассчитываем позицию подсказки относительно SVG
    setTooltipPosition({
      x: mouseEvent.clientX - svgRect.left + 15,
      y: mouseEvent.clientY - svgRect.top - 30,
    });
  };

  const handleRegionClick = (e: Event) => {
    const target = e.target as SVGPathElement;
    const regionId = target.getAttribute('id');
    
    // Проверяем, есть ли филиал в этом регионе
    if (regionId && regionsWithBranches.includes(regionId)) {
      setSelectedRegion(regionId);
      
      // Находим филиал в выбранном регионе
      const branch = branchesData.find(branch => branch.regionCode === regionId);
      if (branch) {
        setSelectedBranch(branch);
      }
    }
  };

  // Обработчик изменения выбора филиала в выпадающем списке
  const handleBranchSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = parseInt(e.target.value);
    const branch = branchesData.find(branch => branch.id === branchId);
    
    if (branch) {
      setSelectedBranch(branch);
      setSelectedRegion(branch.regionCode);
      
      // Выделяем выбранный регион на карте
      if (mapRef.current) {
        const regions = mapRef.current.querySelectorAll('.region');
        regions.forEach(region => {
          region.classList.remove('selected');
          
          if (region.getAttribute('id') === branch.regionCode) {
            region.classList.add('selected');
          }
        });
      }
    }
  };

  return (
    <div className="russia-map-container">
      <div className="interactive-map">
        <div className="map-container">
          <h2 className="map-title">Наши филиалы на карте России</h2>
          <p className="map-subtitle">Выберите регион для просмотра информации о филиале</p>
          
          {/* Карта России */}
          <svg
            ref={mapRef}
            className="russia-map"
            viewBox="0 0 1200 700"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>
              {`
              .region {
                fill: rgba(230, 230, 240, 0.8);
                stroke: #ffffff;
                stroke-width: 1;
                transition: all 0.3s ease;
                cursor: default;
              }
              .region.available {
                fill: rgba(30, 120, 190, 0.8);
                cursor: pointer;
              }
              .region.available:hover {
                fill: rgba(185, 160, 70, 0.9);
                transform: scale(1.02);
                transform-origin: center;
                stroke: #ffffff;
                stroke-width: 2;
                filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
              }
              .region.selected {
                fill: rgba(185, 160, 70, 0.9);
                stroke: #ffffff;
                stroke-width: 2;
              }
              `}
            </style>
            
            {/* Регионы России */}
            <g id="russia-map">
              {/* Центральный федеральный округ */}
              <path id="RU-MOS" className="region" data-title="Московская область" d="M330,240 L350,220 L370,230 L365,250 L345,260 Z" />
              <path id="RU-MOW" className="region" data-title="Москва" d="M335,235 L340,230 L345,235 L340,240 Z" />
              <path id="RU-BEL" className="region" data-title="Белгородская область" d="M300,280 L320,270 L330,285 L320,295 L305,290 Z" />
              <path id="RU-BRY" className="region" data-title="Брянская область" d="M290,270 L310,260 L320,270 L300,280 L280,275 Z" />
              <path id="RU-IVA" className="region" data-title="Ивановская область" d="M370,230 L390,220 L400,235 L390,245 L370,240 Z" />
              <path id="RU-KLU" className="region" data-title="Калужская область" d="M310,250 L330,240 L335,255 L325,260 L310,255 Z" />
              <path id="RU-KOS" className="region" data-title="Костромская область" d="M380,210 L400,200 L410,215 L400,225 L380,220 Z" />
              <path id="RU-KRS" className="region" data-title="Курская область" d="M310,290 L330,280 L340,295 L330,305 L310,300 Z" />
              <path id="RU-LIP" className="region" data-title="Липецкая область" d="M340,275 L360,265 L370,280 L360,290 L340,285 Z" />
              <path id="RU-ORL" className="region" data-title="Орловская область" d="M330,260 L350,250 L360,265 L340,275 L325,270 Z" />
              <path id="RU-RYA" className="region" data-title="Рязанская область" d="M360,250 L380,240 L390,255 L380,265 L360,260 Z" />
              <path id="RU-SMO" className="region" data-title="Смоленская область" d="M290,240 L310,230 L320,245 L310,250 L290,245 Z" />
              <path id="RU-TAM" className="region" data-title="Тамбовская область" d="M350,285 L370,275 L380,290 L370,300 L350,295 Z" />
              <path id="RU-TUL" className="region" data-title="Тульская область" d="M335,255 L355,245 L365,260 L355,270 L335,265 Z" />
              <path id="RU-TVE" className="region" data-title="Тверская область" d="M320,220 L340,210 L350,225 L340,235 L320,230 Z" />
              <path id="RU-VLA" className="region" data-title="Владимирская область" d="M370,240 L390,230 L400,245 L390,255 L370,250 Z" />
              <path id="RU-VOR" className="region" data-title="Воронежская область" d="M360,290 L380,280 L390,295 L380,305 L360,300 Z" />
              <path id="RU-YAR" className="region" data-title="Ярославская область" d="M350,210 L370,200 L380,215 L370,225 L350,220 Z" />
              
              {/* Северо-Западный федеральный округ */}
              <path id="RU-LEN" className="region" data-title="Ленинградская область" d="M290,180 L320,150 L350,160 L340,190 L300,200 Z" />
              <path id="RU-SPE" className="region" data-title="Санкт-Петербург" d="M300,175 L310,170 L315,180 L305,185 Z" />
              <path id="RU-KGD" className="region" data-title="Калининградская область" d="M210,190 L230,180 L240,195 L230,205 L210,200 Z" />
              <path id="RU-KR" className="region" data-title="Республика Карелия" d="M355,120 L385,105 L400,130 L380,145 L360,130 Z" />
              <path id="RU-KO" className="region" data-title="Республика Коми" d="M410,140 L450,120 L470,150 L450,170 L420,160 Z" />
              <path id="RU-ARK" className="region" data-title="Архангельская область" d="M380,120 L420,100 L450,130 L430,150 L390,140 Z" />
              <path id="RU-MUR" className="region" data-title="Мурманская область" d="M350,80 L380,60 L400,85 L380,100 L350,90 Z" />
              <path id="RU-NEN" className="region" data-title="Ненецкий АО" d="M450,90 L490,70 L520,100 L500,120 L450,110 Z" />
              <path id="RU-NGR" className="region" data-title="Новгородская область" d="M320,200 L340,190 L350,205 L340,215 L320,210 Z" />
              <path id="RU-PSK" className="region" data-title="Псковская область" d="M280,210 L300,200 L310,215 L300,225 L280,220 Z" />
              <path id="RU-VLG" className="region" data-title="Вологодская область" d="M360,180 L380,170 L390,185 L380,195 L360,190 Z" />
              
              {/* Южный федеральный округ */}
              <path id="RU-AD" className="region" data-title="Республика Адыгея" d="M240,360 L250,350 L260,360 L250,370 Z" />
              <path id="RU-AST" className="region" data-title="Астраханская область" d="M380,350 L400,340 L410,355 L400,365 L380,360 Z" />
              <path id="RU-VGG" className="region" data-title="Волгоградская область" d="M375,320 L395,310 L405,325 L395,335 L375,330 Z" />
              <path id="RU-ROS" className="region" data-title="Ростовская область" d="M280,340 L300,330 L310,345 L300,355 L280,350 Z" />
              <path id="RU-KDA" className="region" data-title="Краснодарский край" d="M225,350 L255,330 L280,345 L265,365 L230,360 Z" />
              <path id="RU-SEV" className="region" data-title="Севастополь" d="M215,370 L220,365 L225,370 L220,375 Z" />
              <path id="RU-KRY" className="region" data-title="Республика Крым" d="M200,360 L230,350 L240,370 L220,380 L200,370 Z" />
              <path id="RU-KL" className="region" data-title="Республика Калмыкия" d="M340,340 L360,330 L370,345 L360,355 L340,350 Z" />
              
              {/* Северо-Кавказский федеральный округ */}
              <path id="RU-CE" className="region" data-title="Чеченская Республика" d="M290,380 L300,375 L305,385 L295,390 Z" />
              <path id="RU-IN" className="region" data-title="Республика Ингушетия" d="M285,375 L295,370 L300,380 L290,385 Z" />
              <path id="RU-KB" className="region" data-title="Кабардино-Балкарская Республика" d="M275,370 L285,365 L290,375 L280,380 Z" />
              <path id="RU-KC" className="region" data-title="Карачаево-Черкесская Республика" d="M260,370 L270,365 L275,375 L265,380 Z" />
              <path id="RU-DA" className="region" data-title="Республика Дагестан" d="M310,370 L330,360 L340,375 L330,385 L310,380 Z" />
              <path id="RU-SE" className="region" data-title="Республика Северная Осетия" d="M280,375 L290,370 L295,380 L285,385 Z" />
              <path id="RU-STA" className="region" data-title="Ставропольский край" d="M290,345 L310,335 L320,350 L310,360 L290,355 Z" />
              
              {/* Приволжский федеральный округ */}
              <path id="RU-BA" className="region" data-title="Республика Башкортостан" d="M470,250 L500,240 L510,255 L500,265 L470,260 Z" />
              <path id="RU-ME" className="region" data-title="Республика Марий Эл" d="M410,240 L430,230 L440,245 L430,255 L410,250 Z" />
              <path id="RU-MO" className="region" data-title="Республика Мордовия" d="M390,260 L410,250 L420,265 L410,275 L390,270 Z" />
              <path id="RU-KIR" className="region" data-title="Кировская область" d="M430,200 L450,190 L460,205 L450,215 L430,210 Z" />
              <path id="RU-NIZ" className="region" data-title="Нижегородская область" d="M390,230 L410,220 L420,235 L410,245 L390,240 Z" />
              <path id="RU-ORE" className="region" data-title="Оренбургская область" d="M450,280 L470,270 L480,285 L470,295 L450,290 Z" />
              <path id="RU-PNZ" className="region" data-title="Пензенская область" d="M400,270 L420,260 L430,275 L420,285 L400,280 Z" />
              <path id="RU-PER" className="region" data-title="Пермский край" d="M480,200 L510,190 L520,205 L510,215 L480,210 Z" />
              <path id="RU-SAM" className="region" data-title="Самарская область" d="M430,270 L450,260 L460,275 L450,285 L430,280 Z" />
              <path id="RU-SAR" className="region" data-title="Саратовская область" d="M420,290 L440,280 L450,295 L440,305 L420,300 Z" />
              <path id="RU-TA" className="region" data-title="Республика Татарстан" d="M440,230 L460,220 L470,235 L460,245 L440,240 Z" />
              <path id="RU-UD" className="region" data-title="Удмуртская Республика" d="M450,220 L470,210 L480,225 L470,235 L450,230 Z" />
              <path id="RU-ULY" className="region" data-title="Ульяновская область" d="M410,260 L430,250 L440,265 L430,275 L410,270 Z" />
              <path id="RU-CU" className="region" data-title="Чувашская Республика" d="M430,230 L450,220 L460,235 L450,245 L430,240 Z" />
              
              {/* Уральский федеральный округ */}
              <path id="RU-KGN" className="region" data-title="Курганская область" d="M520,240 L540,230 L550,245 L540,255 L520,250 Z" />
              <path id="RU-SVE" className="region" data-title="Свердловская область" d="M530,220 L550,210 L560,225 L550,235 L530,230 Z" />
              <path id="RU-TYU" className="region" data-title="Тюменская область" d="M550,190 L580,180 L590,195 L580,205 L550,200 Z" />
              <path id="RU-CHE" className="region" data-title="Челябинская область" d="M530,240 L550,230 L560,245 L550,255 L530,250 Z" />
              <path id="RU-KHM" className="region" data-title="Ханты-Мансийский АО" d="M570,160 L600,150 L610,165 L600,175 L570,170 Z" />
              <path id="RU-YAN" className="region" data-title="Ямало-Ненецкий АО" d="M580,120 L610,110 L620,125 L610,135 L580,130 Z" />
              
              {/* Сибирский федеральный округ */}
              <path id="RU-ALT" className="region" data-title="Алтайский край" d="M500,300 L520,290 L530,305 L520,315 L500,310 Z" />
              <path id="RU-AL" className="region" data-title="Республика Алтай" d="M480,320 L500,310 L510,325 L500,335 L480,330 Z" />
              <path id="RU-BU" className="region" data-title="Республика Бурятия" d="M650,300 L670,290 L680,305 L670,315 L650,310 Z" />
              <path id="RU-ZAB" className="region" data-title="Забайкальский край" d="M700,280 L720,270 L730,285 L720,295 L700,290 Z" />
              <path id="RU-IRK" className="region" data-title="Иркутская область" d="M650,240 L670,230 L680,245 L670,255 L650,250 Z" />
              <path id="RU-KEM" className="region" data-title="Кемеровская область" d="M580,250 L600,240 L610,255 L600,265 L580,260 Z" />
              <path id="RU-KYA" className="region" data-title="Красноярский край" d="M620,220 L640,210 L650,225 L640,235 L620,230 Z" />
              <path id="RU-NVS" className="region" data-title="Новосибирская область" d="M580,230 L600,220 L610,235 L600,245 L580,240 Z" />
              <path id="RU-OMS" className="region" data-title="Омская область" d="M540,230 L560,220 L570,235 L560,245 L540,240 Z" />
              <path id="RU-TOM" className="region" data-title="Томская область" d="M590,210 L610,200 L620,215 L610,225 L590,220 Z" />
              <path id="RU-TY" className="region" data-title="Республика Тыва" d="M600,270 L620,260 L630,275 L620,285 L600,280 Z" />
              <path id="RU-KK" className="region" data-title="Республика Хакасия" d="M610,260 L630,250 L640,265 L630,275 L610,270 Z" />
              
              {/* Дальневосточный федеральный округ */}
              <path id="RU-AMU" className="region" data-title="Амурская область" d="M780,260 L800,250 L810,265 L800,275 L780,270 Z" />
              <path id="RU-YEV" className="region" data-title="Еврейская АО" d="M820,270 L835,265 L840,275 L830,280 Z" />
              <path id="RU-KAM" className="region" data-title="Камчатский край" d="M900,200 L920,190 L930,205 L920,215 L900,210 Z" />
              <path id="RU-MAG" className="region" data-title="Магаданская область" d="M850,170 L870,160 L880,175 L870,185 L850,180 Z" />
              <path id="RU-PRI" className="region" data-title="Приморский край" d="M840,290 L860,280 L870,295 L860,305 L840,300 Z" />
              <path id="RU-KHA" className="region" data-title="Хабаровский край" d="M820,230 L840,220 L850,235 L840,245 L820,240 Z" />
              <path id="RU-CHU" className="region" data-title="Чукотский АО" d="M900,90 L930,70 L950,100 L930,110 L900,100 Z" />
              <path id="RU-SA" className="region" data-title="Республика Саха (Якутия)" d="M750,150 L780,140 L790,155 L780,165 L750,160 Z" />
              <path id="RU-SAK" className="region" data-title="Сахалинская область" d="M880,230 L890,225 L895,235 L885,240 Z" />
            </g>
          </svg>
          
          {/* Всплывающая подсказка */}
          {showTooltip && (
            <div 
              ref={tooltipRef}
              className="region-tooltip visible"
              style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
            >
              <h4>{tooltipContent.title}</h4>
              <p>
                {regionsWithBranches.includes(tooltipContent.regionCode) 
                  ? 'Есть филиал. Нажмите для просмотра информации' 
                  : 'Нет филиала'}
              </p>
            </div>
          )}
        </div>
        
        {/* Секция со списком филиалов */}
        <div className="branches-list">
          <h3 className="branch-title">Наши филиалы</h3>
          
          <div className="branches-select-container">
            <select 
              className="select"
              onChange={handleBranchSelectChange}
              value={selectedBranch?.id || ''}
            >
              <option value="" disabled>Выберите филиал</option>
              {branchesData.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.city} ({branch.regionName})
                </option>
              ))}
            </select>
          </div>
          
          {/* Информация о выбранном филиале */}
          {selectedBranch && (
            <div className="branch-details animate-fade-in">
              <div className="branch-detail-item">
                <div className="branch-detail-label">Город:</div>
                <div className="branch-detail-value">{selectedBranch.city}</div>
              </div>
              
              <div className="branch-detail-item">
                <div className="branch-detail-label">Адрес:</div>
                <div className="branch-detail-value">{selectedBranch.address}</div>
              </div>
              
              <div className="branch-detail-item">
                <div className="branch-detail-label">Телефон:</div>
                <div className="branch-detail-value">
                  <a href={`tel:${selectedBranch.phone}`}>{selectedBranch.phone}</a>
                </div>
              </div>
              
              <div className="branch-detail-item">
                <div className="branch-detail-label">Email:</div>
                <div className="branch-detail-value">
                  <a href={`mailto:${selectedBranch.email}`}>{selectedBranch.email}</a>
                </div>
              </div>
              
              <div className="branch-detail-item">
                <div className="branch-detail-label">Режим работы:</div>
                <div className="branch-detail-value">{selectedBranch.workingHours}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveRussiaMap;