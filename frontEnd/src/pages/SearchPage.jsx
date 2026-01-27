import { useState, useEffect } from 'react';
import { Search, Filter, Star, Heart, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { toastError } from '../utils/toast';

function SearchPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    categoria: '',
    priceRange: 'todos',
    rating: 0,
  });
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300?text=Sem+Imagem';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${apiUrl}/uploads/images/${path}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedFilters.categoria) params.append('categoria', selectedFilters.categoria);
        // Adicionar outros filtros aqui quando o backend suportar

        const response = await fetch(`${apiUrl}/api/produtos?${params.toString()}`);
        if (!response.ok) throw new Error('Erro ao buscar produtos');
        
        const data = await response.json();
        const productList = data.data || data.produtos || (Array.isArray(data) ? data : []);
        setProducts(productList);
      } catch (error) {
        console.error(error);
        toastError('Não foi possível buscar os produtos.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const handler = setTimeout(() => {
      fetchProducts();
    }, 500); // Espera 500ms após o usuário parar de digitar

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, selectedFilters]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType] === value ? '' : value // Permite desmarcar radio
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      categoria: '',
      priceRange: 'todos',
      rating: 0,
    });
    setSearchTerm('');
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Barra de Busca */}
          <div className="mb-8">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filtros */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Filter size={20} />
                    Filtros
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <X size={16} />
                    Limpar
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Categoria */}
                  <div>
                    <h3 className="font-semibold mb-3">Categoria</h3>
                    <div className="space-y-2">
                      {['Vestuário', 'Calçados', 'Acessórios', 'Eletrônicos'].map(cat => (
                        <label key={cat} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="category"
                            value={cat}
                            checked={selectedFilters.categoria === cat}
                            onChange={() => handleFilterChange('categoria', cat)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Preço */}
                  <div>
                    <h3 className="font-semibold mb-3">Faixa de Preço</h3>
                    <select
                      value={selectedFilters.priceRange}
                      onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="todos">Todos</option>
                      <option value="ate1000">Até 1000 Mts</option>
                      <option value="de1000ate3000">1000 a 3000 Mts</option>
                      <option value="acima3000">Acima de 3000 Mts</option>
                    </select>
                  </div>

                  {/* Classificação */}
                  <div>
                    <h3 className="font-semibold mb-3">Classificação Mínima</h3>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => handleFilterChange('rating', star)}>
                          <Star size={24} className={star <= selectedFilters.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-gray-600">
                  {loading ? 'Buscando...' : `Mostrando ${products.length} produto(s)`}
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Search size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">Nenhum produto encontrado.</p>
                  <button
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800 font-semibold mt-4"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition group cursor-pointer"
                      onClick={() => navigate(`/produto/${product.id}`)}
                    >
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={getImageUrl(product.imagem_capa || product.imagem)}
                          alt={product.nome}
                          className="w-full h-72 object-cover group-hover:scale-105 transition duration-300"
                        />
                        <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                          <Heart size={20} className="text-gray-600" />
                        </button>
                        {product.estoque === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <p className="text-white font-bold text-lg">Fora de Estoque</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2 truncate">{product.nome}</h4>
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < (product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">({product.reviews_count || 0})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-gray-900">
                            Mts {parseFloat(product.preco).toFixed(2)}
                          </p>
                          <Link
                            to={`/produto/${product.id}`}
                            className="text-sm text-blue-600 font-medium group-hover:underline"
                          >
                            Ver
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default SearchPage;
