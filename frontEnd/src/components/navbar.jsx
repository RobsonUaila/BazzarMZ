import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingCart, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from "../contexts/themeContext";


function Navbar() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const getStoredUser = () => {
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    };
    const getStoredCart = () => {
        try {
            return JSON.parse(localStorage.getItem('cart') || '[]');
        } catch {
            return [];
        }
    };
    const [cart, setCart] = useState(getStoredCart);
    const [user, setUser] = useState(getStoredUser);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        setUser(getStoredUser());
        setCart(getStoredCart());
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">BazzarMZ</Link>
                    </div>

                    <nav className="hidden md:flex space-x-8">
                        <Link to="/produtos" className="bg-red-600 500 text-white hover:bg-gray-500 hover:text-white rounded-full p-2">Produtos</Link>
                        <Link to="/produtos" className="text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white rounded-full p-2">Cosmeticos</Link>
                        <Link to="/produtos" className="text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white rounded-full p-2">Higiene e Limpeza</Link>
                        <Link to="/produtos" className="text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white rounded-full p-2">Acessórios</Link>
                        <Link to="/produtos" className="text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white rounded-full p-2">Casa</Link>
                        <Link to="/produtos" className="text-gray-700 dark:text-gray-300 hover:bg-gray-500 hover:text-white rounded-full p-2">Vestuario</Link>

                    </nav>

                    <div className="flex items-center">
                        {/* Desktop Icons */}
                        <div className="hidden md:flex items-center space-x-4">
                        <Link to="/search" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                            <Search size={20} />
                        </Link>
                        
                        {user ? (
                            <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" title={user.nome}>
                                <User size={20} />
                            </Link>
                        ) : (
                            <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium">
                                Login
                            </Link>
                        )}

                        <Link to="/favorites" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                            <Heart size={20} />
                        </Link>
                        <Link to="/checkout" className="relative text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                            <ShoppingCart size={20} />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </Link>
                        <button onClick={toggleTheme} className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white ml-2">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Abrir menu"
                                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
                            >
                                {menuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Mobile */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="px-4 py-3 space-y-3">
                        {/* Mobile Icons moved inside menu */}
                        <Link to="/search" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">
                            <Search size={20} className="mr-3" /> Buscar
                        </Link>
                        
                        <Link to="/checkout" className="flex items-center justify-between text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">
                            <div className="flex items-center">
                                <ShoppingCart size={20} className="mr-3" /> Carrinho
                            </div>
                            {cart.length > 0 && (
                                <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        <Link to="/favorites" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">
                            <Heart size={20} className="mr-3" /> Favoritos
                        </Link>

                        <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

                        <Link to="/produtos" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Todos</Link>
                        <Link to="/produtos" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Vestuário</Link>
                        <Link to="/produtos" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Calçados</Link>
                        <Link to="/produtos" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Acessórios</Link>
                        <Link to="/produtos" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Eletrônicos</Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
                            {user ? (
                                <>
                                    <Link to="/profile" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">
                                        <User size={20} className="mr-3" /> Meu Perfil
                                    </Link>
                                    <Link to="/orders" className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">Meus Pedidos</Link>
                                    <button 
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-red-600 hover:text-red-800 font-semibold"
                                    >
                                        <LogOut size={18} className="mr-2" /> Sair
                                    </button>
                                </>
                            ) : (
                                <Link to="/login" className="block text-blue-600 hover:text-blue-800 font-semibold">Login</Link>
                            )}
                            <button onClick={toggleTheme} className="flex items-center w-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">
                                <span className="mr-3">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</span> Alternar Tema
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
