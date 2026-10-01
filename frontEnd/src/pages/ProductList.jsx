import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { toastError } from '../utils/toast';

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [favorites, setFavorites] = useState([]);

  const productsPerPage = 12;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300?text=Sem+Imagem';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${apiUrl}/uploads/images/${path}`;
  };

  useEffect(() => {
    fetchProducts();
    loadFavorites();
  }, [currentPage, searchTerm, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${apiUrl}/api/produtos?page=${currentPage}&limit=${productsPerPage}`;

      if (searchTerm) url += `&search=${searchTerm}`;
      if (category) url += `&categoria=${category}`;

      const response = await fetch(url);

      if (!response.ok) throw new Error('Erro ao carregar produtos');

      const data = await response.json();

      // Ajuste para estrutura do backend: { success: true, data: [...], pagination: {...} }
      // Garante que pegamos o array, seja em data.data, data.produtos ou no próprio data
      const listaProdutos = (data.data && Array.isArray(data.data)) ? data.data : (data.produtos && Array.isArray(data.produtos) ? data.produtos : (Array.isArray(data) ? data : []));
      setProducts(listaProdutos);

      const totalPagesCalc = data.pagination?.pages || Math.ceil((data.total || listaProdutos.length) / productsPerPage);
      setTotalPages(totalPagesCalc || 1);
    } catch (error) {
      console.error(error);
      // Fallback para produtos estáticos
      setProducts([]);
      toastError('Não foi possível carregar os produtos.');
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved.map(fav => fav.id));
  };

  const toggleFavorite = (product) => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorited = saved.find(fav => fav.id === product.id);

    if (isFavorited) {
      const updated = saved.filter(fav => fav.id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setFavorites(updated.map(fav => fav.id));
    } else {
      saved.push({
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        imagem: product.imagem_capa || product.imagem
      });
      localStorage.setItem('favorites', JSON.stringify(saved));
      setFavorites([...favorites, product.id]);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => String(item.id) === String(product.id));

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        imagem: product.imagem_capa || product.imagem,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary text-primary">
      <Navbar />

      <div className="grow max-w-[1400px] mx-auto w-full px-6 lg:px-12 py-16">
        {/* Header */}
        <div className="mb-12 border-b border-primary/20 pb-8">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold uppercase tracking-tighter mb-4 text-primary">Catálogo</h1>
          <p className="text-primary/60 font-sans uppercase tracking-widest text-sm">Explore nossa curadoria de produtos exclusivos</p>
        </div>

        {/* Filtros */}
        <div className="bg-primary/5 p-6 mb-16 border border-primary/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="PROCURAR..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-secondary border border-primary/20 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent font-sans rounded-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary/70 mb-2">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-secondary border border-primary/20 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent font-sans rounded-none appearance-none uppercase text-sm tracking-wider"
              >
                <option value="">Todas as categorias</option>
                <option value="Vestuário">Vestuário</option>
                <option value="Casa">Casa</option>
                <option value="Acessórios">Acessórios</option>
                <option value="Higiene e Limpeza">Higiene e Limpeza</option>
                <option value="Cosmeticos">Cosméticos</option>
                <option value="Diversos">Diversos</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategory('');
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 bg-primary text-secondary hover:bg-accent font-display font-bold uppercase tracking-widest rounded-none transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mb-16">
              {products.map((product, index) => (
                <article
                  key={product.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/produto/${product.id}`)}
                >
                  <div className="relative overflow-hidden bg-primary/5 h-[280px] md:h-[320px] mb-3">
                    {/* Badge */}
                    {product.estoque < 5 && product.estoque > 0 && (
                      <div className="absolute top-3 left-[-1rem] bg-accent text-secondary font-display font-bold uppercase tracking-widest py-1 px-4 text-[9px] z-10 shadow-lg">
                        Restam {product.estoque}
                      </div>
                    )}
                    
                    {/* Image */}
                    <img
                      src={getImageUrl(product.imagem_capa || product.imagem)}
                      alt={product.nome}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:-rotate-1 grayscale hover:grayscale-0"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop'; }}
                    />

                    {/* Favorite Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
                      className="absolute top-3 right-3 text-primary hover:text-accent transition-colors z-10 bg-secondary/90 p-2 rounded-full backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-sm"
                    >
                      <Heart size={16} strokeWidth={2.5} className={favorites.includes(product.id) ? 'fill-accent text-accent' : ''} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="flex justify-between items-start gap-3 px-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-primary/50 mb-1 truncate">{product.categoria || 'Sem categoria'}</div>
                      <h4 className="font-display font-bold text-lg md:text-xl text-primary uppercase tracking-tight group-hover:text-accent transition-colors line-clamp-2 leading-tight">
                        {product.nome}
                      </h4>
                    </div>
                    <div className="text-right shrink-0 pl-2">
                      <div className="font-display font-bold text-lg md:text-xl text-primary whitespace-nowrap">
                        {parseFloat(product.preco).toFixed(0)} <span className="text-[10px]">MTS</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-12">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-secondary border border-primary/20 text-primary hover:bg-primary hover:text-secondary disabled:opacity-30 disabled:hover:bg-secondary disabled:hover:text-primary transition-colors rounded-none"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-5 py-3 font-display font-bold text-lg transition-colors rounded-none ${currentPage === i + 1
                        ? 'bg-primary text-secondary border border-primary'
                        : 'bg-secondary border border-primary/20 text-primary hover:bg-primary hover:text-secondary'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-secondary border border-primary/20 text-primary hover:bg-primary hover:text-secondary disabled:opacity-30 disabled:hover:bg-secondary disabled:hover:text-primary transition-colors rounded-none"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ProductList;
