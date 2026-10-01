import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, Heart, ShoppingCart, LogOut } from 'lucide-react';
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

  const navLinks = [
    { name: 'Produtos', path: '/produtos' },
    { name: 'Cosméticos', path: '/produtos' },
    { name: 'Vestuário', path: '/produtos' },
    { name: 'Casa', path: '/produtos' },
  ];

  return (
    <header className="bg-secondary text-primary border-b-2 border-primary sticky top-0 z-50 transition-colors duration-200 uppercase font-sans tracking-widest text-sm">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link to="/" className="text-4xl font-display font-extrabold tracking-tighter uppercase relative group">
              QS.
              <span className="absolute -bottom-2 left-0 w-0 h-1 bg-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-10">
            {navLinks.map((link, idx) => (
              <Link 
                key={idx} 
                to={link.path} 
                className="relative font-bold hover:text-accent transition-colors py-2 overflow-hidden group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent transform -translate-x-full transition-transform duration-300 group-hover:translate-x-0"></span>
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-6 border-l-2 border-primary pl-6 ml-6 h-12">
              <Link to="/search" className="hover:text-accent transition-colors">
                <Search size={22} strokeWidth={2.5} />
              </Link>

              {user ? (
                <Link to="/profile" className="hover:text-accent transition-colors" title={user.nome}>
                  <User size={22} strokeWidth={2.5} />
                </Link>
              ) : (
                <Link to="/login" className="hover:text-accent transition-colors font-bold underline decoration-2 underline-offset-4">
                  LOGIN
                </Link>
              )}

              <Link to="/favorites" className="hover:text-accent transition-colors">
                <Heart size={22} strokeWidth={2.5} />
              </Link>

              <Link to="/checkout" className="relative hover:text-accent transition-colors">
                <ShoppingCart size={22} strokeWidth={2.5} />
                {cart.length > 0 && (
                  <span className="absolute -top-3 -right-3 bg-accent text-white font-bold text-[10px] w-5 h-5 flex items-center justify-center rounded-none">
                    {cart.length}
                  </span>
                )}
              </Link>
              
              {/* Theme toggle - Minimalist approach */}
              <button onClick={toggleTheme} className="hover:text-accent font-bold ml-4">
                {theme === 'dark' ? 'LT' : 'DK'}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center ml-4">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="hover:text-accent p-2"
              >
                {menuOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-primary text-secondary absolute w-full border-t border-secondary/20">
          <div className="px-6 py-8 flex flex-col space-y-6 font-display text-2xl font-bold">
            {navLinks.map((link, idx) => (
              <Link key={idx} to={link.path} className="hover:text-accent transition-colors">
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-secondary/20 my-4"></div>
            
            <Link to="/search" className="flex items-center hover:text-accent transition-colors">
              <Search size={24} className="mr-4" /> Buscar
            </Link>
            
            <Link to="/checkout" className="flex items-center justify-between hover:text-accent transition-colors">
              <div className="flex items-center">
                <ShoppingCart size={24} className="mr-4" /> Carrinho
              </div>
              {cart.length > 0 && (
                <span className="bg-accent text-white text-sm px-3 py-1">
                  {cart.length}
                </span>
              )}
            </Link>
            
            <Link to="/favorites" className="flex items-center hover:text-accent transition-colors">
              <Heart size={24} className="mr-4" /> Favoritos
            </Link>

            <div className="border-t border-secondary/20 pt-6 mt-2 space-y-6">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center hover:text-accent transition-colors">
                    <User size={24} className="mr-4" /> Perfil
                  </Link>
                  <button onClick={handleLogout} className="flex items-center text-accent hover:text-white transition-colors">
                    <LogOut size={24} className="mr-4" /> Sair
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-accent hover:text-white transition-colors">Login / Registo</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
