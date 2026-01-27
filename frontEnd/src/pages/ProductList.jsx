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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="grow container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Nossos Produtos</h1>
          <p className="text-gray-600">Explore nossa coleção de produtos de qualidade</p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                <option value="Vestuário">Vestuário</option>
                <option value="Calçados">Calçados</option>
                <option value="Acessórios">Acessórios</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategory('');
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map(product => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/produto/${product.id}`)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  {/* Imagem */}
                  <Link to={`/produto/${product.id}`}>
                    <div className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer">
                      <img
                        src={getImageUrl(product.imagem_capa || product.imagem)}
                        alt={product.nome}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      {product.estoque < 5 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Restam {product.estoque}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    {/* Categoria */}
                    <span className="inline-block text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded mb-2">
                      {product.categoria || 'Sem categoria'}
                    </span>

                    {/* Nome */}
                    <Link
                      to={`/produto/${product.id}`}
                      className="block font-semibold text-gray-900 mb-2 hover:text-blue-600 transition line-clamp-2"
                    >
                      {product.nome}
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="text-xs text-gray-500">4.5</span>
                    </div>

                    {/* Preço */}
                    <div className="mb-4">
                      <span className="text-xl font-bold text-green-600">
                        MT{parseFloat(product.preco).toFixed(2)}
                      </span>
                    </div>

                    {/* Chamada para Ação Visual */}
                    <div className="mt-4 text-sm text-blue-600 font-medium group-hover:underline">
                      Ver detalhes e comprar &rarr;
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mb-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
