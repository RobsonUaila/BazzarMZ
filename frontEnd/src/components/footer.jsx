import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <footer className="bg-primary text-secondary pt-24 pb-12 border-t-4 border-accent">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        {/* Massive Typography Section */}
        <div className="mb-20 text-center md:text-left relative">
          <h2 className="text-[12vw] leading-none font-display font-extrabold uppercase tracking-tighter opacity-10 select-none absolute -top-16 left-0">
            QUICK
          </h2>
          <h2 className="text-5xl md:text-8xl font-display font-extrabold uppercase tracking-tighter relative z-10">
            Mantenha-se <br /> <span className="text-accent">À Frente.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 font-sans">
          {/* Brand Info */}
          <div className="md:col-span-1">
            <h4 className="font-display font-bold text-2xl mb-6 uppercase tracking-widest">Quick Sales</h4>
            <p className="text-secondary/70 mb-8 font-light text-lg">
              Redefinindo o consumo com curadoria implacável e estética sem concessões.
            </p>
            <div className="flex gap-6">
              <a href="https://www.facebook.com/share/1CHKSfXtRv/" target="_blank" rel="noopener noreferrer" className="text-secondary/50 hover:text-accent transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-secondary/50 hover:text-accent transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-secondary/50 hover:text-accent transition-colors">
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-sm mb-6 uppercase tracking-widest text-secondary/50">Suporte</h4>
            <ul className="space-y-4 text-lg font-light">
              <li><Link to="/ajuda" className="hover:text-accent transition-colors relative inline-block group">FAQ<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span></Link></li>
              <li><Link to="/politicas#envio" className="hover:text-accent transition-colors relative inline-block group">Envios<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span></Link></li>
              <li><Link to="/politicas#devo" className="hover:text-accent transition-colors relative inline-block group">Devoluções<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-sm mb-6 uppercase tracking-widest text-secondary/50">Explorar</h4>
            <ul className="space-y-4 text-lg font-light">
              <li><Link to="/" className="hover:text-accent transition-colors relative inline-block group">Início<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span></Link></li>
              <li><Link to="/search" className="hover:text-accent transition-colors relative inline-block group">Buscar<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span></Link></li>
              <li><Link to="/produtos" className="hover:text-accent transition-colors relative inline-block group">Catálogo<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent transition-all group-hover:w-full"></span></Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold text-sm mb-6 uppercase tracking-widest text-secondary/50">Contato</h4>
            <ul className="space-y-4 text-lg font-light">
              <li><a href="mailto:contato@QuickSales.com" className="hover:text-accent transition-colors flex items-center gap-3"><Mail size={18} /> contato@QuickSales.com</a></li>
              <li><a href="https://wa.me/258862996561" className="hover:text-accent transition-colors flex items-center gap-3"><Phone size={18} /> +258 86 299 6561</a></li>
              <li className="flex gap-3 text-secondary/70"><MapPin size={18} className="shrink-0" /> Maputo, Moçambique</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-light text-secondary/50 uppercase tracking-wider">
          <div className="flex gap-6">
            <Link to="/politicas" className="hover:text-accent transition-colors">Privacidade</Link>
            <Link to="/politicas#termos" className="hover:text-accent transition-colors">Termos</Link>
            <Link to="/politicas#cookies" className="hover:text-accent transition-colors">Cookies</Link>
          </div>
          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Quick Sales. Todos os direitos reservados.</p>
            <p className="mt-1">Desenvolvido por Zetix.Labs</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;