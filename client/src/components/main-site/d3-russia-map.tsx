import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
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

// Интерфейс для GeoJSON
interface GeoFeature {
  type: string;
  properties: {
    name: string;
    iso_3166_2: string;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

interface GeoJSON {
  type: string;
  features: GeoFeature[];
}

const D3RussiaMap: React.FC = () => {
  // Создаем референс для SVG элемента
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Состояния компонента
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Список регионов, где есть филиалы
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
      email: 'info@investl.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 2,
      city: 'Санкт-Петербург',
      regionCode: 'RU-LEN',
      regionName: 'Ленинградская область',
      address: 'г. Санкт-Петербург, пр. Энергетиков, д. 4к1, БЦ Амбер Холл, оф. 1206',
      phone: '+7 (921) 951-20-70',
      email: 'info@investl.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 3,
      city: 'Нижний Новгород',
      regionCode: 'RU-NIZ',
      regionName: 'Нижегородская область',
      address: '603040, г. Нижний Новгород, проспект Союзный, д. 45, офис 11 (этаж 4), Бизнес центр "Володарский"',
      phone: '+7 (919) 110-70-66',
      email: 'info@investl.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 4,
      city: 'Тамбов',
      regionCode: 'RU-TAM',
      regionName: 'Тамбовская область',
      address: 'г. Тамбов, улица Мичуринская 146, оф 7',
      phone: '+7 (919) 110-70-25',
      email: 'info@investl.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 5,
      city: 'Тольятти',
      regionCode: 'RU-SAM',
      regionName: 'Самарская область',
      address: '445030, Самарская обл., г. Тольятти, ул. 70 лет Октября, д.31А',
      phone: '+7 (919) 110-70-15',
      email: 'info@investl.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 6,
      city: 'Тюмень',
      regionCode: 'RU-TYU',
      regionName: 'Тюменская область',
      address: '625007, г. Тюмень, ул. 30 лет Победы, д. 38А, офис 53',
      phone: '+7 (3452) 39-34-83',
      email: 'info@investl.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 7,
      city: 'Ульяновск',
      regionCode: 'RU-ULY',
      regionName: 'Ульяновская область',
      address: '432072, г. Ульяновск, проспект Туполева, д. 31, стр. 1 (этаж 1), Бизнес центр "Взлетный"',
      phone: '+7 (982) 370-04-26',
      email: 'info@investl.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 8,
      city: 'Уфа',
      regionCode: 'RU-BA',
      regionName: 'Республика Башкортостан',
      address: 'Республика Башкортостан, г. Уфа, ул. Кирова, д.128, корпус 2, пом.4',
      phone: '+7 (919) 110-70-06',
      email: 'info@investl.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
    {
      id: 9,
      city: 'Челябинск',
      regionCode: 'RU-CHE',
      regionName: 'Челябинская область',
      address: '454084, г. Челябинск, проспект Победы, д. 147-A, 1 этаж',
      phone: '+7 (351) 791-06-46',
      email: 'info@investl.ru',
      workingHours: 'Пн-Пт: 9:00-18:00',
    },
  ];

  useEffect(() => {
    // Функция для загрузки и инициализации карты
    const initializeMap = async () => {
      try {
        // Загружаем GeoJSON данные для России
        console.log('Загружаю GeoJSON данные...');
        const response = await fetch('/russia.geo.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const geoData: GeoJSON = await response.json();
        console.log('GeoJSON данные успешно загружены');
        
        // Если SVG элемент существует, рендерим карту
        if (svgRef.current) {
          console.log('Рендерю карту...');
          renderMap(geoData);
        }
      } catch (error) {
        console.error('Ошибка при загрузке GeoJSON данных:', error);
      }
    };

    // Вызываем инициализацию
    initializeMap();
  }, []);

  // Рендеринг карты с D3.js
  const renderMap = (geoData: GeoJSON) => {
    if (!svgRef.current) return;

    console.log('Количество регионов в GeoJSON:', geoData.features.length);
    
    // Очищаем SVG
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Размеры SVG
    const width = 800;
    const height = 500;
    
    // Создаем проекцию для карты России
    const projection = d3.geoAlbers()
      .rotate([-105, 0])
      .center([0, 60])
      .parallels([50, 70])
      .scale(700)
      .translate([width / 2, height / 2]);
    
    // Создаем path генератор
    const pathGenerator = d3.geoPath().projection(projection);
    
    // Создаем SVG контейнер
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Добавляем группу для всей карты и применяем масштабирование
    const g = svg.append('g');
    
    // Создаем и стилизуем пути для регионов
    g.selectAll('path')
      .data(geoData.features)
      .join('path')
      .attr('d', (d) => pathGenerator(d as any) || '')
      .attr('class', d => {
        const regionCode = d.properties.iso_3166_2;
        return `region ${regionsWithBranches.includes(regionCode) ? 'has-filial' : ''}`;
      })
      .attr('data-region', d => d.properties.iso_3166_2)
      .attr('data-name', d => d.properties.name)
      .on('mouseover', (event, d) => handleMouseOver(event, d))
      .on('mousemove', (event) => handleMouseMove(event))
      .on('mouseout', () => handleMouseOut())
      .on('click', (event, d) => handleRegionClick(event, d));
      
    // Добавляем возможность зума и перемещения
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom as any);
  };

  // Обработчики событий для интерактивности
  const handleMouseOver = (event: any, d: any) => {
    const regionCode = d.properties.iso_3166_2;
    const regionName = d.properties.name;
    
    if (tooltipRef.current) {
      // Показываем подсказку
      tooltipRef.current.style.visibility = 'visible';
      tooltipRef.current.innerHTML = `
        <div>${regionName}</div>
        ${regionsWithBranches.includes(regionCode) ? '<div class="has-branch">Есть филиал</div>' : ''}
      `;
    }
    
    // Добавляем класс при наведении
    d3.select(event.currentTarget).classed('hover', true);
  };

  const handleMouseMove = (event: any) => {
    if (tooltipRef.current) {
      // Обновляем позицию подсказки
      tooltipRef.current.style.left = `${event.pageX + 15}px`;
      tooltipRef.current.style.top = `${event.pageY - 30}px`;
    }
  };

  const handleMouseOut = () => {
    if (tooltipRef.current) {
      // Скрываем подсказку
      tooltipRef.current.style.visibility = 'hidden';
    }
    
    // Удаляем класс при уходе мыши
    d3.selectAll('.region').classed('hover', false);
  };

  const handleRegionClick = (event: any, d: any) => {
    const regionCode = d.properties.iso_3166_2;
    
    // Проверяем, есть ли филиал в регионе
    if (regionsWithBranches.includes(regionCode)) {
      setSelectedRegion(regionCode);
      
      // Находим информацию о филиале
      const branch = branchesData.find(b => b.regionCode === regionCode);
      if (branch) {
        setSelectedBranch(branch);
      }
      
      // Удаляем выделение со всех регионов и выделяем выбранный
      d3.selectAll('.region').classed('selected', false);
      d3.select(event.currentTarget).classed('selected', true);
    }
  };

  // Обработчик изменения выбора филиала в выпадающем списке
  const handleBranchSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const branchId = parseInt(e.target.value);
    if (!branchId) {
      setSelectedBranch(null);
      setSelectedRegion(null);
      
      // Снимаем выделение со всех регионов
      d3.selectAll('.region').classed('selected', false);
      return;
    }
    
    const branch = branchesData.find(branch => branch.id === branchId);
    if (branch) {
      setSelectedBranch(branch);
      setSelectedRegion(branch.regionCode);
      
      // Удаляем выделение со всех регионов и выделяем выбранный
      d3.selectAll('.region').classed('selected', false);
      d3.select(`path[data-region="${branch.regionCode}"]`).classed('selected', true);
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold mb-2 text-center">Наши филиалы на карте России</h2>
          <p className="text-sm text-muted-foreground mb-6 text-center">Выберите регион для просмотра информации о филиале</p>
          
          {/* D3 SVG карта */}
          <div className="relative mx-auto max-w-3xl">
            <svg ref={svgRef} className="w-full h-auto"></svg>
            <div ref={tooltipRef} className="map-tooltip" style={{ visibility: 'hidden' }}></div>
          </div>
        </div>
        
        <div className="w-full md:w-1/3">
          {/* Информация о филиале */}
          <div className="border border-border rounded-lg p-5 bg-card/50 backdrop-blur-sm shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-center">Наши филиалы</h3>
            <div className="relative mb-6">
              <select 
                className="w-full p-3 rounded-md bg-background border border-input text-sm appearance-none pr-10"
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
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-opacity-80 text-xs pointer-events-none">▼</div>
            </div>
            
            {selectedBranch && (
              <div className="space-y-3 animate-fade-in">
                <h4 className="text-lg font-medium text-primary">{selectedBranch.city}</h4>
                <div className="text-sm space-y-2">
                  <p><span className="font-medium">Регион:</span> {selectedBranch.regionName}</p>
                  <p><span className="font-medium">Адрес:</span> {selectedBranch.address}</p>
                  <p><span className="font-medium">Телефон:</span> <a href={`tel:${selectedBranch.phone}`} className="text-primary hover:underline">{selectedBranch.phone}</a></p>
                  <p><span className="font-medium">Email:</span> <a href={`mailto:${selectedBranch.email}`} className="text-primary hover:underline">{selectedBranch.email}</a></p>
                  <p><span className="font-medium">Режим работы:</span> {selectedBranch.workingHours}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default D3RussiaMap;