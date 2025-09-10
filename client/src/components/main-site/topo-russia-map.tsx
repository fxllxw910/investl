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

interface GeoFeature {
  type: string;
  properties: {
    name: string;
    name_latin?: string;
    cartodb_id?: number;
    created_at?: string;
    updated_at?: string;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

interface GeoJSON {
  type: string;
  bbox?: number[];
  features: GeoFeature[];
}

const RussiaMap: React.FC = () => {
  // Создаем референсы для SVG и всплывающей подсказки
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Состояния компонента
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showNoBranchPopup, setShowNoBranchPopup] = useState<boolean>(false);
  const [noBranchRegionName, setNoBranchRegionName] = useState<string>('');

  // Карта соответствия имен регионов с их кодами
  const regionNameToCode: {[key: string]: string} = {
    'Краснодарский край': 'RU-KDA',
    'Ленинградская область': 'RU-LEN',
    'Нижегородская область': 'RU-NIZ',
    'Тамбовская область': 'RU-TAM',
    'Самарская область': 'RU-SAM',
    'Тюменская область': 'RU-TYU',
    'Ульяновская область': 'RU-ULY',
    'Башкортостан': 'RU-BA',
    'Бурятия': 'RU-BU',
    'Челябинская область': 'RU-CHE'
  };

  // Список регионов с филиалами (имена регионов)
  const regionsWithBranches = [
    'Краснодарский край',
    'Ленинградская область',
    'Нижегородская область',
    'Тамбовская область',
    'Самарская область',
    'Тюменская область',
    'Ульяновская область',
    'Башкортостан',
    'Челябинская область'
  ];

  // Данные о филиалах
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
      regionName: 'Башкортостан',
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

  useEffect(() => {
    // Загрузка и инициализация карты
    const initializeMap = async () => {
      try {
        console.log('Загружаю GeoJSON данные...');
        const response = await fetch('/russia-geo.json');
        
        if (!response.ok) {
          throw new Error(`HTTP ошибка! Статус: ${response.status}`);
        }
        
        const geoData: GeoJSON = await response.json();
        console.log('GeoJSON данные успешно загружены');
        
        if (svgRef.current) {
          console.log('Рендерю карту...');
          renderMap(geoData);
        }

        // Обработчик изменения размера окна
        const handleResize = () => {
          if (svgRef.current) {
            renderMap(geoData);
          }
        };

        window.addEventListener('resize', handleResize);
        
        // Очистка при размонтировании
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error('Ошибка при загрузке GeoJSON данных:', error);
      }
    };

    initializeMap();
  }, []);

  // Закрыть попап
  const closeNoBranchPopup = () => {
    setShowNoBranchPopup(false);
  };

  // Рендеринг карты
  const renderMap = (geoData: GeoJSON) => {
    if (!svgRef.current) return;
    
    // Очищаем SVG
    d3.select(svgRef.current).selectAll('*').remove();
    
    // Получаем фактический размер контейнера
    const actualWidth = mapContainerRef.current?.offsetWidth || 800;
    const aspectRatio = 1.8; // Более компактное соотношение сторон
    const height = actualWidth / aspectRatio;
    
    // Масштабируем в зависимости от ширины контейнера
    const baseScale = (actualWidth / 1182) * 600;
    
    // Корректируем центр для лучшего позиционирования карты России
    const projection = d3.geoAlbers()
      .rotate([-105, 0])
      .center([0, 65]) // Смещаем центр выше для более компактной карты
      .parallels([50, 70])
      .scale(baseScale * 1.2) // Увеличиваем масштаб для заполнения пространства
      .translate([actualWidth / 2, height / 2]); // Центрируем без дополнительного смещения
    
    // Создаем path генератор
    const path = d3.geoPath().projection(projection);
    
    // Создаем адаптивный SVG контейнер
    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height)
      .attr('viewBox', `0 0 ${actualWidth} ${height}`)
      .style('max-width', '100%')
      .style('height', 'auto')
      .style('overflow', 'visible')
      .attr('preserveAspectRatio', 'xMidYMid meet');
    
    // Добавляем группу для границ страны
    const boundaryGroup = svg.append('g')
      .attr('class', 'boundary-regions');
    
    // Создаем и стилизуем пути для регионов
    svg.append('g')
      .selectAll('.region')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('class', (d: any) => {
        const regionName = d.properties.name;
        return regionsWithBranches.includes(regionName) ? 'region has-branch' : 'region';
      })
      .attr('d', (d: any) => path(d) as string)
      .attr('data-region', (d: any) => regionNameToCode[d.properties.name] || '')
      .attr('data-name', (d: any) => d.properties.name)
      .on('mouseover', function(event: any, d: any) {
        // Отображаем всплывающую подсказку
        if (tooltipRef.current) {
          tooltipRef.current.style.visibility = 'visible';
          tooltipRef.current.style.left = event.pageX + 10 + 'px';
          tooltipRef.current.style.top = event.pageY - 20 + 'px';
          tooltipRef.current.innerHTML = `
            <div>${d.properties.name}</div>
            ${regionsWithBranches.includes(d.properties.name) ? '<div class="has-branch">Есть филиал</div>' : ''}
          `;
        }
      })
      .on('mousemove', function(event: any) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = event.pageX + 10 + 'px';
          tooltipRef.current.style.top = event.pageY - 20 + 'px';
        }
      })
      .on('mouseout', function(event: any, d: any) {
        if (tooltipRef.current) {
          tooltipRef.current.style.visibility = 'hidden';
        }
      })
      .on('click', function(event: any, d: any) {
        const regionName = d.properties.name;
        
        // Проверяем, есть ли филиал в регионе
        if (regionsWithBranches.includes(regionName)) {
          // Находим информацию о филиале по имени региона
          const branch = branchesData.find(b => b.regionName === regionName);
          
          if (branch) {
            setSelectedBranch(branch);
            setSelectedRegion(branch.regionCode);
            
            // Удаляем класс selected со всех регионов и выделяем выбранный
            d3.selectAll('.region').classed('selected', false);
            d3.select(event.currentTarget).classed('selected', true);
          }
        } else {
          // Показываем попап об отсутствии филиала
          setNoBranchRegionName(regionName);
          setShowNoBranchPopup(true);
        }
      });

    // Добавляем границу всех регионов России (обводку)
    // Создаем копию границ всех регионов для неоновой подсветки
    boundaryGroup.append('path')
      .datum({
        type: 'FeatureCollection',
        features: geoData.features
      })
      .attr('d', path as any)
      .attr('class', 'russia-boundary');
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
      
      // Удаляем выделение со всех регионов
      d3.selectAll('.region').classed('selected', false);
      
      // Находим регион по имени и выделяем его
      const regions = d3.selectAll('.region');
      regions.each(function(d: any) {
        if (d.properties.name === branch.regionName) {
          d3.select(this).classed('selected', true);
        }
      });
    }
  };

  return (
    <div className="py-6">
      <div className="flex flex-col gap-8">
        {/* Заголовок и выпадающий список */}
        <div className="mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">Наши филиалы на карте России</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Выберите регион для просмотра информации о филиале
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Левая колонка: селектор и информация о филиале */}
          <div className="lg:w-1/3 flex flex-col gap-4">
            <div className="relative">
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
              <div className="branch-info-card">
                <h4 className="text-lg font-medium text-primary">{selectedBranch.city}</h4>
                <div className="text-sm space-y-3 mt-4">
                  <p><span className="font-medium">Регион:</span> {selectedBranch.regionName}</p>
                  <p><span className="font-medium">Адрес:</span> {selectedBranch.address}</p>
                  <p><span className="font-medium">Телефон:</span> <a href={`tel:${selectedBranch.phone}`} className="text-primary hover:underline">{selectedBranch.phone}</a></p>
                  <p><span className="font-medium">Email:</span> <a href={`mailto:${selectedBranch.email}`} className="text-primary hover:underline">{selectedBranch.email}</a></p>
                  <p><span className="font-medium">Режим работы:</span> {selectedBranch.workingHours}</p>
                </div>
              </div>
            )}
          </div>
        
          {/* Правая колонка: карта */}
          <div className="lg:w-2/3 relative">
            <div className="map-container w-full" ref={mapContainerRef} style={{ width: '100%', minHeight: '350px', overflow: 'visible' }}>
              <svg ref={svgRef} className="w-full"></svg>
              <div 
                ref={tooltipRef} 
                className="map-tooltip" 
                style={{ visibility: 'hidden' }}
              ></div>
              
              {/* Попап об отсутствии филиала */}
              {showNoBranchPopup && (
                <div className="no-branch-popup">
                  <button className="popup-close" onClick={closeNoBranchPopup}>×</button>
                  <p>В регионе <strong>{noBranchRegionName}</strong> отсутствует филиал компании.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RussiaMap;