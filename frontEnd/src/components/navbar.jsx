import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingCart } from 'lucide-react';
import { useTheme } from "../contexts/themeContext";


function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [cart, ] = useState([]);
    const { toggleTheme } = useTheme;

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <button
                            className="md:hidden mr-4"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <Link to="/" className="text-2xl font-bold text-gray-900">BazzarMZ</Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/search" className="text-gray-700 hover:bg-gray-500 hover:text-white rounded-full p-2">Novidades</Link>
                        <Link to="/search" className="text-gray-700 hover:bg-gray-500 hover:text-white rounded-full p-2">Cosmeticos</Link>
                        <Link to="/search" className="text-gray-700  hover:bg-gray-500 hover:text-white rounded-full p-2">Produtos de Limpeza</Link>
                        <Link to="/search" className="text-gray-700 hover:bg-gray-500 hover:text-white rounded-full p-2">Acessórios</Link>
                        <Link to="/search" className="text-red-600 font-semibold  hover:bg-gray-500 hover:text-white rounded-full p-2">Promoções</Link>

                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link to="/search" className="text-gray-700 hover:text-gray-900">
                            <Search size={20} />
                        </Link>
                        <Link to="/profile" className="text-gray-700 hover:text-gray-900">
                            <User size={20} />
                        </Link>
                        <Link to="/favorites" className="text-gray-700 hover:text-gray-900">
                            <Heart size={20} />
                        </Link>
                        <Link to="/checkout" className="relative text-gray-700 hover:text-gray-900">
                            <ShoppingCart size={20} />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-4 py-3 space-y-3">
                        <Link to="/search" className="block text-gray-700 hover:text-gray-900">Novidades</Link>
                        <Link to="/search" className="block text-gray-700 hover:text-gray-900">Cosmeticos</Link>
                        <Link to="/search" className="block text-gray-700 hover:text-gray-900">Produtos de Limpeza</Link>
                        <Link to="/search" className="block text-gray-700 hover:text-gray-900">Acessórios</Link>
                        <Link to="/search" className="block text-red-600 font-semibold">Promoções</Link>
                        <div className="border-t pt-3 space-y-2">
                            <Link to="/profile" className="block text-gray-700 hover:text-gray-900">Meu Perfil</Link>
                            <Link to="/favorites" className="block text-gray-700 hover:text-gray-900">Favoritos</Link>
                            <Link to="/orders" className="block text-gray-700 hover:text-gray-900">Meus Pedidos</Link>
                            <Link to="/login" className="block text-blue-600 hover:text-blue-800 font-semibold">Login</Link>
                            <button onClick={toggleTheme}>
                                🌙 / ☀️
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;