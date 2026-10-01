import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Quick Sales</h4>
            <p className="text-sm mb-4">
              Sua loja online com os melhores produtos e os melhores preços. Compre com segurança e rapidez.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-md font-bold mb-4">Ajuda & Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/ajuda" className="hover:text-white transition-colors">Perguntas Frequentes</Link></li>
              <li><Link to="/politicas#envio" className="hover:text-white transition-colors">Prazos de Envio</Link></li>
              <li><Link to="/politicas#devo" className="hover:text-white transition-colors">Trocas e Devoluções</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-md font-bold mb-4">Acesso Rápido</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Início</Link></li>
              <li><Link to="/produtos" className="hover:text-white transition-colors">Todos os Produtos</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Minha Conta</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-md font-bold mb-4">Fale Connosco</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail size={16} /> contato@QuickSales.com</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +258 86 299 6561</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> Maputo, Moçambique</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex gap-4 mb-4 md:mb-0">
            <Link to="/politicas" className="hover:text-white">Privacidade</Link>
            <Link to="/politicas#termos" className="hover:text-white">Termos de Uso</Link>
          </div>
          <div className="text-center md:text-right">
            <p>&copy; {new Date().getFullYear()} Quick Sales. Todos os direitos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;