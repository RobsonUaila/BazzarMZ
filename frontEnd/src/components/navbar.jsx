import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingCart, LogOut } from 'lucide-react';

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

  const navLinks = [
    { name: 'Produtos', path: '/produtos' },
    { name: 'Vestuário', path: '/produtos' },
    { name: 'Cosméticos', path: '/produtos' },
    { name: 'Casa', path: '/produtos' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              Quick Sales
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link, idx) => (
              <Link 
                key={idx} 
                to={link.path} 
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-5">
            <div className="hidden md:flex items-center space-x-5">
              <Link to="/search" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Search size={20} />
              </Link>

              {user ? (
                <Link to="/profile" className="text-gray-500 hover:text-blue-600 transition-colors" title={user.nome}>
                  <User size={20} />
                </Link>
              ) : (
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Entrar
                </Link>
              )}

              <Link to="/favorites" className="text-gray-500 hover:text-blue-600 transition-colors">
                <Heart size={20} />
              </Link>

              <Link to="/checkout" className="relative text-gray-500 hover:text-blue-600 transition-colors">
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white font-bold text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-gray-500 hover:text-blue-600 p-2"
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
          <div className="px-4 py-4 flex flex-col space-y-4">
            {navLinks.map((link, idx) => (
              <Link key={idx} to={link.path} className="text-gray-700 hover:text-blue-600 font-medium">
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-100 my-2"></div>
            
            <Link to="/search" className="flex items-center text-gray-700 hover:text-blue-600">
              <Search size={20} className="mr-3" /> Buscar
            </Link>
            
            <Link to="/checkout" className="flex items-center justify-between text-gray-700 hover:text-blue-600">
              <div className="flex items-center">
                <ShoppingCart size={20} className="mr-3" /> Carrinho
              </div>
              {cart.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>
            
            <Link to="/favorites" className="flex items-center text-gray-700 hover:text-blue-600">
              <Heart size={20} className="mr-3" /> Favoritos
            </Link>

            <div className="border-t border-gray-100 pt-4 mt-2 space-y-4">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center text-gray-700 hover:text-blue-600">
                    <User size={20} className="mr-3" /> Meu Perfil
                  </Link>
                  <button onClick={handleLogout} className="flex items-center text-red-500 hover:text-red-700">
                    <LogOut size={20} className="mr-3" /> Sair
                  </button>
                </>
              ) : (
                <Link to="/login" className="block text-blue-600 font-medium">Entrar / Registar</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
