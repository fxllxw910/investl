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

// Компонент интерактивной карты России
const InteractiveRussiaMapV2: React.FC = () => {
  // Список регионов, где есть филиалы (актуальные)
  const regionsWithBranches = [
    'RU-KDA', // Краснодарский край
    'RU-LEN', // Ленинградская область
    'RU-NIZ', // Нижегородская область
    'RU-TAM', // Тамбовская область
    'RU-SAM', // Самарская область
    'RU-TYU', // Тюменская область
    'RU-ULY', // Ульяновская область
    'RU-BA',  // Башкортостан
    'RU-CHE', // Челябинская область
  ];

  // Данные о филиалах с реальными данными
  const branchesData: Branch[] = [
    {
      id: 1,
      city: 'Краснодар',
      regionCode: 'RU-KDA',
      regionName: 'Краснодарский край',
      address: 'г. Краснодар ул. Российская д. 388 офис 5',
      phone: '+7 (919) 110-70-55',
      email: 'il_uda@chelinvest.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 2,
      city: 'Санкт-Петербург',
      regionCode: 'RU-LEN',
      regionName: 'Ленинградская область',
      address: 'г. Санкт-Петербург, пр. Энергетиков, д. 4к1, БЦ Амбер Холл, оф. 1206',
      phone: '+7 (921) 951-20-70',
      email: 'd.chadaev@chelinvest.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 3,
      city: 'Нижний Новгород',
      regionCode: 'RU-NIZ',
      regionName: 'Нижегородская область',
      address: '603040, г. Нижний Новгород, проспект Союзный, д. 45, офис 11 (этаж 4), Бизнес центр "Володарский"',
      phone: '+7 (919) 110-70-66',
      email: 'g.fateeva@chelinvest.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 4,
      city: 'Тамбов',
      regionCode: 'RU-TAM',
      regionName: 'Тамбовская область',
      address: 'г. Тамбов, улица Мичуринская 146, оф 7',
      phone: '+7 (919) 110-70-25',
      email: 'o.korolev@chelinvest.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 5,
      city: 'Тольятти',
      regionCode: 'RU-SAM',
      regionName: 'Самарская область',
      address: '445030, Самарская обл., г. Тольятти, ул. 70 лет Октября, д.31А',
      phone: '+7 (919) 110-70-15',
      email: 'l.mironova@chelinvest.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 6,
      city: 'Тюмень',
      regionCode: 'RU-TYU',
      regionName: 'Тюменская область',
      address: '625007, г. Тюмень, ул. 30 лет Победы, д. 38А, офис 53',
      phone: '+7 (3452) 39-34-83',
      email: 'mihalaki@chelinvest.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 7,
      city: 'Ульяновск',
      regionCode: 'RU-ULY',
      regionName: 'Ульяновская область',
      address: '432072, г. Ульяновск, проспект Туполева, д. 31, стр. 1 (этаж 1), Бизнес центр "Взлетный"',
      phone: '+7 (982) 370-04-26',
      email: 'i.sandimirova@chelinvest.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 8,
      city: 'Уфа',
      regionCode: 'RU-BA',
      regionName: 'Республика Башкортостан',
      address: 'Республика Башкортостан, г. Уфа, ул. Кирова, д.128, корпус 2, пом.4',
      phone: '+7 (919) 110-70-06',
      email: 'e.kochkurova@chelinvest.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 9,
      city: 'Челябинск',
      regionCode: 'RU-CHE',
      regionName: 'Челябинская область',
      address: '454084, г. Челябинск, проспект Победы, д. 147-A, 1 этаж',
      phone: '+7 (351) 791-06-46',
      email: 'il@chelinvest.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
  ];

  // Состояния компонента
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState({ title: '', regionCode: '' });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
  // Используем useRef с более конкретным типом для объекта SVG
  const svgObjectRef = useRef<HTMLObjectElement>(null);

  // Добавляем обработчики событий после загрузки SVG
  useEffect(() => {
    const handleSvgLoad = () => {
      const svgObject = svgObjectRef.current;
      if (!svgObject) return;
      
      const svgDocument = svgObject.contentDocument;
      if (!svgDocument) return;
      
      const regions = svgDocument.querySelectorAll('path');
      regions.forEach(region => {
        const regionId = region.getAttribute('id');
        
        // Помечаем регионы с филиалами
        if (regionId && regionsWithBranches.includes(regionId)) {
          region.classList.add('available');
        }
        
        // Добавляем data-атрибуты для идентификации и заголовки
        if (regionId) {
          region.setAttribute('data-code', regionId);
          const branchInfo = branchesData.find(b => b.regionCode === regionId);
          region.setAttribute('data-title', branchInfo?.regionName || regionId);
        }
        
        // Добавляем обработчики событий
        region.addEventListener('mouseenter', handleRegionMouseEnter);
        region.addEventListener('mouseleave', handleRegionMouseLeave);
        region.addEventListener('mousemove', handleRegionMouseMove);
        region.addEventListener('click', handleRegionClick);
      });
    };
    
    // Устанавливаем обработчик загрузки SVG
    const svgObject = svgObjectRef.current;
    if (svgObject) {
      svgObject.addEventListener('load', handleSvgLoad);
    }
    
    return () => {
      if (svgObject) {
        svgObject.removeEventListener('load', handleSvgLoad);
      }
    };
  }, []);

  // Обработчики событий для регионов
  const handleRegionMouseEnter = (e: Event) => {
    const target = e.target as SVGPathElement;
    const regionId = target.getAttribute('data-code');
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
    if (!svgObjectRef.current) return;
    
    const mouseEvent = e as MouseEvent;
    const svgRect = svgObjectRef.current.getBoundingClientRect();
    
    // Рассчитываем позицию подсказки относительно SVG
    setTooltipPosition({
      x: mouseEvent.clientX - svgRect.left + 15,
      y: mouseEvent.clientY - svgRect.top - 30,
    });
  };

  const handleRegionClick = (e: Event) => {
    const target = e.target as SVGPathElement;
    const regionId = target.getAttribute('data-code');
    
    // Проверяем, есть ли филиал в этом регионе
    if (regionId && regionsWithBranches.includes(regionId)) {
      setSelectedRegion(regionId);
      
      // Находим филиал в выбранном регионе
      const branch = branchesData.find(branch => branch.regionCode === regionId);
      if (branch) {
        setSelectedBranch(branch);
      }
      
      // Выделяем выбранный регион на карте
      const svgDocument = svgObjectRef.current?.contentDocument;
      if (svgDocument) {
        const regions = svgDocument.querySelectorAll('path');
        if (regions) {
          regions.forEach(r => {
            r.classList.remove('selected');
            if (r.getAttribute('data-code') === regionId) {
              r.classList.add('selected');
            }
          });
        }
      }
    }
  };

  // Обработчик изменения выбора филиала в выпадающем списке
  const handleBranchSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = parseInt(e.target.value);
    if (!branchId) {
      setSelectedBranch(null);
      setSelectedRegion(null);
      
      // Снимаем выделение со всех регионов
      const svgDocument = svgObjectRef.current?.contentDocument;
      if (svgDocument) {
        const regions = svgDocument.querySelectorAll('path');
        if (regions) {
          regions.forEach(r => r.classList.remove('selected'));
        }
      }
      return;
    }
    
    const branch = branchesData.find(branch => branch.id === branchId);
    
    if (branch) {
      setSelectedBranch(branch);
      setSelectedRegion(branch.regionCode);
      
      // Выделяем выбранный регион на карте
      const svgDocument = svgObjectRef.current?.contentDocument;
      if (svgDocument) {
        const regions = svgDocument.querySelectorAll('path');
        if (regions) {
          regions.forEach(r => {
            r.classList.remove('selected');
            if (r.getAttribute('data-code') === branch.regionCode) {
              r.classList.add('selected');
            }
          });
        }
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
          <div className="rf-map">
            <object 
              ref={svgObjectRef}
              className="russia-map"
              type="image/svg+xml" 
              data="/russia_map.svg"
              width="100%" 
              height="100%"
            />
            
            {/* Всплывающая подсказка */}
            {showTooltip && (
              <div 
                className="map-tooltip" 
                style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
              >
                <div className="tooltip-title">{tooltipContent.title}</div>
                {regionsWithBranches.includes(tooltipContent.regionCode) && (
                  <div className="tooltip-branch">Есть филиал</div>
                )}
              </div>
            )}
          </div>
          
          {/* Информация о филиале */}
          <div className="branch-info">
            <h3>Наши филиалы</h3>
            <div className="branch-select-wrapper">
              <select 
                className="branch-select"
                value={selectedBranch?.id || ''}
                onChange={handleBranchSelectChange}
              >
                <option value="">Выберите филиал</option>
                {branchesData.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.city} ({branch.regionName})
                  </option>
                ))}
              </select>
              <div className="select-arrow">▼</div>
            </div>
            
            {selectedBranch && (
              <div className="branch-details">
                <h4>{selectedBranch.city}</h4>
                <p><strong>Регион:</strong> {selectedBranch.regionName}</p>
                <p><strong>Адрес:</strong> {selectedBranch.address}</p>
                <p><strong>Телефон:</strong> {selectedBranch.phone}</p>
                <p><strong>Email:</strong> {selectedBranch.email}</p>
                <p><strong>Режим работы:</strong> {selectedBranch.workingHours}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRussiaMapV2;