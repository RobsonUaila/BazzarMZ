import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <footer className="bg-gray-900 text-white mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Sobre */}
                    <div>
                        <h4 className="font-bold text-lg mb-4">BazzarMZ</h4>
                        <p className="text-gray-400 mb-4">
                            Sua loja online com os melhores produtos e os melhores preços.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Ajuda */}
                    <div>
                        <h4 className="font-bold mb-4">Ajuda</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link to="/ajuda" className="hover:text-white transition">FAQ</Link>
                            </li>
                            <li>
                                <Link to="/politicas#envio" className="hover:text-white transition">Envios</Link>
                            </li>
                            <li>
                                <Link to="/politicas#devo" className="hover:text-white transition">Devoluções</Link>
                            </li>
                            <li>
                                <Link to="/politicas#garantia" className="hover:text-white transition">Garantia</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Sobre */}
                    <div>
                        <h4 className="font-bold mb-4">Navegação</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link to="/" className="hover:text-white transition">Início</Link>
                            </li>
                            <li>
                                <Link to="/search" className="hover:text-white transition">Buscar</Link>
                            </li>
                            {user && (
                                <>
                                    <li>
                                        <Link to="/profile" className="hover:text-white transition">Meu Perfil</Link>
                                    </li>
                                    <li>
                                        <Link to="/orders" className="hover:text-white transition">Meus Pedidos</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div id='contactos'>
                        <h4 className="font-bold mb-4">Contacte-nos</h4>
                        <ul className="space-y-3 text-gray-400">
                            <li className="flex items-center gap-2">
                                <Mail size={18} />
                                <a href="mailto:bazzarmzs@gmail.com" className="hover:text-white transition">
                                    contato@bazarmz.com
                                </a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={18} />
                                <a href="https://wa.me/258835130967" className="hover:text-white transition">
                                    +258 83 513 0967
                                </a>
                            </li>
                            <li className="flex gap-2">
                                <MapPin size={18} className="shrink-0" />
                                <span>Maputo, Moçambique</span>
                            </li>
                        </ul>
                    </div>
                </div>


                {/* Links Rápidos */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-sm text-gray-400">
                    <Link to="/politicas" className="hover:text-white transition">Política de Privacidade</Link>
                    <Link to="/politicas#termos" className="hover:text-white transition">Termos de Serviço</Link>
                    <Link to="/politicas#cookies" className="hover:text-white transition">Política de Cookies</Link>

                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>&copy; 2024 BazzarMZ. Todos os direitos reservados.</p>
                    <p className="text-sm mt-2">Desenvolvido por Robson Uaila</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;