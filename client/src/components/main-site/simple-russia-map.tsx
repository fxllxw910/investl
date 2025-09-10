import { useState, useEffect, useRef } from 'react';
import './russia-map.css';

interface Region {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

interface SimpleRussiaMapProps {
  regions: Region[];
  onRegionSelect: (region: Region) => void;
}

export const SimpleRussiaMap = ({ regions, onRegionSelect }: SimpleRussiaMapProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Найти регион по коду
  const getRegionByCode = (code: string) => {
    return regions.find(r => r.code === code);
  };
  
  // Регионы, которые у нас есть в данных
  const availableRegionCodes = regions.map(r => r.code);
  
  // Загрузка и обработка SVG карты
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch('/russia_map.svg');
        const svgText = await response.text();
        
        if (svgRef.current) {
          svgRef.current.innerHTML = svgText;
          
          // Добавить классы и обработчики событий к регионам на карте
          const svgElement = svgRef.current;
          const regionElements = svgElement.querySelectorAll('path.region');
          
          regionElements.forEach(region => {
            const regionCode = region.getAttribute('id');
            
            if (regionCode && availableRegionCodes.includes(regionCode)) {
              region.classList.add('available');
              
              // Добавляем обработчики событий для доступных регионов
              region.addEventListener('mouseenter', () => {
                setHoveredRegion(regionCode);
              });
              
              region.addEventListener('mouseleave', () => {
                setHoveredRegion(null);
              });
              
              region.addEventListener('click', () => {
                const found = getRegionByCode(regionCode);
                if (found) {
                  onRegionSelect(found);
                }
              });
            }
          });
          
          // Убедимся, что SVG помещается внутри контейнера
          if (mapContainerRef.current && svgElement) {
            const containerRect = mapContainerRef.current.getBoundingClientRect();
            const svgWidth = containerRect.width;
            svgElement.style.maxWidth = `${svgWidth}px`;
            svgElement.style.maxHeight = "100%";
          }
          
          setMapLoaded(true);
        }
      } catch (error) {
        console.error('Ошибка при загрузке SVG карты:', error);
      }
    };
    
    loadSvg();
    
    // Добавим обработчик изменения размера окна
    const handleResize = () => {
      if (mapContainerRef.current && svgRef.current) {
        const containerRect = mapContainerRef.current.getBoundingClientRect();
        const svgWidth = containerRect.width;
        svgRef.current.style.maxWidth = `${svgWidth}px`;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [regions, availableRegionCodes, onRegionSelect]);
  
  return (
    <div className="simple-russia-map-container" ref={mapContainerRef}>      
      <div className="map-container">
        {/* Карта России в виде SVG */}
        <div className="map-outline">
          <div className="map-background">
            <svg 
              ref={svgRef} 
              className={`russia-map ${mapLoaded ? 'loaded' : ''}`} 
              viewBox="0 0 1200 600" 
              preserveAspectRatio="xMidYMid meet"
              style={{ maxWidth: "100%", height: "auto" }}
            />
            <div className="map-title">Карта филиалов</div>
          </div>
          
          {/* Метки городов */}
          <div className="map-points">
            {mapLoaded && hoveredRegion && (
              <div className="region-tooltip">
                {getRegionByCode(hoveredRegion)?.city || hoveredRegion}
              </div>
            )}
            
            {/* Точки для каждого региона на карте */}
            {regions.map(region => (
              <div
                key={region.id}
                className={`map-point ${hoveredRegion === region.code ? 'active' : ''}`}
                style={getPointPosition(region.code)}
                onMouseEnter={() => setHoveredRegion(region.code)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => onRegionSelect(region)}
              >
                {hoveredRegion === region.code && (
                  <div className="city-label">
                    {region.city}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Функция для определения позиции точки на карте для каждого региона
const getPointPosition = (code: string): React.CSSProperties => {
  // Координаты для каждого региона (в процентах от размера контейнера)
  const coordinates: Record<string, { left: string; top: string }> = {
    'RU-KDA': { left: '23%', top: '75%' },     // Краснодар
    'RU-LEN': { left: '27%', top: '26%' },     // Санкт-Петербург
    'RU-NIZ': { left: '35%', top: '46%' },     // Нижний Новгород
    'RU-TAM': { left: '32%', top: '53%' },     // Тамбов
    'RU-SAM': { left: '43%', top: '56%' },     // Тольятти
    'RU-TYU': { left: '58%', top: '43%' },     // Тюмень
    'RU-ULY': { left: '39%', top: '54%' },     // Ульяновск
    'RU-BA': { left: '48%', top: '52%' },      // Уфа
    'RU-CHE': { left: '52%', top: '48%' }      // Челябинск
  };
  
  return coordinates[code] || { left: '50%', top: '50%' }; // Дефолтная позиция
};