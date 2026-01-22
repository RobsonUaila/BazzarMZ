import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { toastError } from '../utils/toast';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [favorites, setFavorites] = useState([]);

  const productsPerPage = 12;

  useEffect(() => {
    fetchProducts();
    loadFavorites();
  }, [currentPage, searchTerm, category]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      let url = `${apiUrl}/api/produtos?page=${currentPage}&limit=${productsPerPage}`;
      
      if (searchTerm) url += `&search=${searchTerm}`;
      if (category) url += `&categoria=${category}`;

      const response = await fetch(url);
      
      if (!response.ok) throw new Error('Erro ao carregar produtos');
      
      const data = await response.json();
      setProducts(data.produtos || data);
      setTotalPages(Math.ceil((data.total || data.length) / productsPerPage));
    } catch (error) {
      console.error(error);
      // Fallback para produtos estáticos
      const staticProducts = [
        {
          id: 1,
          nome: "Camiseta Premium",
          preco: 89.90,
          imagem: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
          imagem_capa: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
          categoria: "Vestuário",
          descricao: "Camiseta de alta qualidade em algodão 100%",
          estoque: 15
        },
        {
          id: 2,
          nome: "Jeans Clássico",
          preco: 159.90,
          imagem: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
          imagem_capa: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
          categoria: "Vestuário",
          descricao: "Jeans resistente e confortável",
          estoque: 8
        },
        {
          id: 3,
          nome: "Tênis Esportivo",
          preco: 299.90,
          imagem: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
          imagem_capa: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
          categoria: "Calçados",
          descricao: "Tênis com tecnologia de amortecimento",
          estoque: 12
        },
        {
          id: 4,
          nome: "Jaqueta de Couro",
          preco: 449.90,
          imagem: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
          imagem_capa: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
          categoria: "Vestuário",
          descricao: "Jaqueta autêntica de couro genuíno",
          estoque: 5
        },
        {
          id: 5,
          nome: "Relógio Elegante",
          preco: 599.90,
          imagem: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
          imagem_capa: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
          categoria: "Acessórios",
          descricao: "Relógio suíço de precisão",
          estoque: 3
        },
        {
          id: 6,
          nome: "Mochila Urban",
          preco: 189.90,
          imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
          imagem_capa: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
          categoria: "Acessórios",
          descricao: "Mochila resistente para uso diário",
          estoque: 20
        }
      ];
      setProducts(staticProducts);
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
    const existingItem = cart.find(item => item.id === product.id);

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
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  {/* Imagem */}
                  <Link to={`/produto/${product.id}`}>
                    <div className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer">
                      <img
                        src={product.imagem_capa || product.imagem}
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

                    {/* Botões */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold flex items-center justify-center gap-2 transition"
                      >
                        <ShoppingCart size={16} />
                        <span className="hidden sm:inline">Adicionar</span>
                      </button>
                      <button
                        onClick={() => toggleFavorite(product)}
                        className={`px-3 py-2 rounded border transition ${
                          favorites.includes(product.id)
                            ? 'bg-red-500 border-red-500 text-white'
                            : 'border-gray-300 text-gray-600 hover:border-red-500'
                        }`}
                      >
                        <Heart size={18} fill={favorites.includes(product.id) ? 'currentColor' : 'none'} />
                      </button>
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
