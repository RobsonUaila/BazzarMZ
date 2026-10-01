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

      const listaProdutos = (data.data && Array.isArray(data.data)) ? data.data : (data.produtos && Array.isArray(data.produtos) ? data.produtos : (Array.isArray(data) ? data : []));
      setProducts(listaProdutos);

      const totalPagesCalc = data.pagination?.pages || Math.ceil((data.total || listaProdutos.length) / productsPerPage);
      setTotalPages(totalPagesCalc || 1);
    } catch (error) {
      console.error(error);
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <div className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-6">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Nossos Produtos</h1>
          <p className="text-gray-500">Explore nossa coleção de produtos de alta qualidade.</p>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 mb-8 rounded-lg shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buscar
              </label>
              <input
                type="text"
                placeholder="Digite o nome do produto..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-white border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-white border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md transition-colors"
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
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold rounded-md transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Grid de Produtos */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado com os filtros atuais.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer overflow-hidden flex flex-col"
                  onClick={() => navigate(`/produto/${product.id}`)}
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    {/* Badge */}
                    {product.estoque < 5 && product.estoque > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white font-bold py-1 px-2 text-xs rounded shadow-sm z-10">
                        Restam {product.estoque}
                      </div>
                    )}
                    
                    {/* Image */}
                    <img
                      src={getImageUrl(product.imagem_capa || product.imagem)}
                      alt={product.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Sem+Imagem'; }}
                    />

                    {/* Favorite Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(product); }}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white p-2 rounded-full shadow-sm"
                    >
                      <Heart size={16} strokeWidth={2.5} className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''} />
                    </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs text-blue-600 font-medium mb-1">{product.categoria || 'Geral'}</span>
                    <h4 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                      {product.nome}
                    </h4>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < 4 ? 'fill-current' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        MT {parseFloat(product.preco).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mb-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors rounded-md"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 font-semibold transition-colors rounded-md flex items-center justify-center ${currentPage === i + 1
                        ? 'bg-blue-600 text-white border border-blue-600'
                        : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-colors rounded-md"
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
