import { Link } from "wouter";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="glass py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">О компании</h3>
            <p className="text-white/70 mb-4">
              ООО «ИНВЕСТ-лизинг» - надежный партнер для всех, кто стремится к успешному развитию своего бизнеса.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://vk.com/investlizingkrasnodar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/60 hover:text-primary transition-colors"
                aria-label="ВКонтакте"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21.579 6.855c.14-.465 0-.806-.666-.806h-2.193c-.558 0-.818.295-.958.619 0 0-1.12 2.728-2.705 4.5-.515.516-.747.68-1.028.68-.14 0-.346-.164-.346-.63v-4.36c0-.56-.162-.806-.624-.806H9.924c-.348 0-.558.257-.558.503 0 .528.79.65.869 2.138v3.229c0 .708-.127.837-.406.837-.742 0-2.546-2.725-3.617-5.845-.209-.606-.42-.847-.98-.847H2.039c-.625 0-.75.294-.75.619 0 .58.742 3.463 3.461 7.27 1.812 2.607 4.363 4.018 6.686 4.018 1.394 0 1.565-.31 1.565-.87v-2.002c0-.64.134-.769.584-.769.332 0 .91.165 2.25 1.458 1.531 1.532 1.785 2.218 2.644 2.218h2.193c.624 0 .937-.31.757-.93-.197-.616-.9-1.514-1.839-2.585-.51-.601-1.275-1.246-1.507-1.568-.325-.419-.231-.604 0-.976 0 0 2.672-3.765 2.952-5.046z"/>
                </svg>
              </a>
              <a 
                href="https://t.me/investlizingkrasnodar" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white/60 hover:text-primary transition-colors"
                aria-label="Telegram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.05 1.577c-.393-.016-.784.08-1.117.235-.484.186-4.92 1.902-9.41 3.64-2.26.873-4.518 1.746-6.256 2.415-1.737.67-3.045 1.168-3.114 1.192-.46.16-1.082.362-1.61.984-.133.155-.267.354-.335.628s-.038.622.095.895c.265.547.714.773 1.244.976 1.76.564 3.58 1.102 5.087 1.608.556 1.96 1.09 3.927 1.618 5.89.174.394.553.54.944.544l-.002.02s.307.03.472-.093c.315-.219.407-.564.53-.847.265-.467 4.987-4.796 5.458-5.335-.044.033 0 0 0 0 .656.332 1.449.593 2.11.794 1.657.5 2.823.365 3.325-.537.995-1.793-1.987-4.044-6.372-6.533-.47-.272-.952-.539-1.444-.797-.917-.475-2.1-.898-3.533-1.302-1.34-.377-2.826-.714-4.328-.964-1.5-.25-2.998-.416-4.415-.43zm-.29.89c1.358.034 2.792.21 4.237.448 1.421.238 2.846.563 4.125.92 1.28.354 2.43.767 3.22 1.152.46.242.827.4 1.285.665 3.647 2.072 5.747 3.97 4.966 5.28-.42.708-2.3.482-3.487.168-.75-.237-1.345-.396-2.018-.762-.347-.198-1.225-.493-1.225-.493s-6.845 6.213-7.28 6.646c-.52.511-.407.371-.376-.238-.1-1.798-.296-6.443-.296-6.443l-.282-.162s-3.876-1.242-5.74-1.846c-1.172-.377-2.925-.938-2.644-1.517.232-.48 1.43-.945 4.22-2.018 1.607-.62 3.59-1.39 5.705-2.207 4.157-1.607 8.4-3.253 8.727-3.383.232-.09.52-.182.834-.17z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Услуги</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/spectechnika" className="text-white/70 hover:text-primary transition-colors">
                  Спецтехника
                </Link>
              </li>
              <li>
                <Link href="/services/oborudovanie" className="text-white/70 hover:text-primary transition-colors">
                  Оборудование
                </Link>
              </li>
              <li>
                <Link href="/services/nedvijimost" className="text-white/70 hover:text-primary transition-colors">
                  Недвижимость
                </Link>
              </li>
              <li>
                <Link href="/services/gruzovye-avtomobili" className="text-white/70 hover:text-primary transition-colors">
                  Грузовые автомобили
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Информация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/70 hover:text-primary transition-colors">
                  О компании
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-white/70 hover:text-primary transition-colors">
                  Партнеры
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/70 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-primary transition-colors">
                  Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/70">info@investl.ru</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/70">+7 (919) 110-70-55</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/70">г. Краснодар ул. Российская д. 388 офис 5</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} ООО «ИНВЕСТ-лизинг». Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
