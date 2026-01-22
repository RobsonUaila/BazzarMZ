import { useState } from 'react';
import { Search, Filter, Star, Heart, X } from 'lucide-react';import { Link } from 'react-router-dom';import Navbar from '../components/navbar';
import Footer from '../components/footer';

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    categoria: '',
    priceRange: 'todos',
    rating: 0,
    inStock: true,
  });

  const [products] = useState([
    {
      id: 1,
      name: 'Camiseta Premium',
      price: 89.90,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      rating: 4.5,
      reviews: 128,
      category: 'Roupas',
      inStock: true,
    },
    {
      id: 2,
      name: 'Jeans Clássico',
      price: 159.90,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
      rating: 4.8,
      reviews: 94,
      category: 'Roupas',
      inStock: true,
    },
    {
      id: 3,
      name: 'Tênis Esportivo',
      price: 299.90,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      rating: 4.9,
      reviews: 203,
      category: 'Calçados',
      inStock: true,
    },
    {
      id: 4,
      name: 'Jaqueta de Couro',
      price: 449.90,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
      rating: 4.7,
      reviews: 76,
      category: 'Roupas',
      inStock: false,
    },
    {
      id: 5,
      name: 'Relógio Elegante',
      price: 599.90,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      rating: 4.6,
      reviews: 145,
      category: 'Acessórios',
      inStock: true,
    },
    {
      id: 6,
      name: 'Mochila Urban',
      price: 189.90,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      rating: 4.4,
      reviews: 89,
      category: 'Acessórios',
      inStock: true,
    },
  ]);

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = !selectedFilters.categoria || product.category === selectedFilters.categoria;
    const matchRating = product.rating >= selectedFilters.rating;
    const matchStock = !selectedFilters.inStock || product.inStock;
    
    let matchPrice = true;
    switch (selectedFilters.priceRange) {
      case 'ate100':
        matchPrice = product.price <= 100;
        break;
      case 'de100ate300':
        matchPrice = product.price > 100 && product.price <= 300;
        break;
      case 'acima300':
        matchPrice = product.price > 300;
        break;
      default:
        matchPrice = true;
    }

    return matchSearch && matchCategory && matchRating && matchStock && matchPrice;
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      categoria: '',
      priceRange: 'todos',
      rating: 0,
      inStock: true,
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
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
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
                      {['Roupas', 'Calçados', 'Acessórios'].map(cat => (
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
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value=""
                          checked={selectedFilters.categoria === ''}
                          onChange={() => handleFilterChange('categoria', '')}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Todas</span>
                      </label>
                    </div>
                  </div>

                  {/* Preço */}
                  <div>
                    <h3 className="font-semibold mb-3">Faixa de Preço</h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Até 100Mts', value: 'ate100' },
                        { label: '100mts a 300mts', value: 'de100ate300' },
                        { label: 'Acima de 300mts', value: 'acima300' },
                        { label: 'Todos', value: 'todos' },
                      ].map(option => (
                        <label key={option.value} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="price"
                            value={option.value}
                            checked={selectedFilters.priceRange === option.value}
                            onChange={() => handleFilterChange('priceRange', option.value)}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Classificação */}
                  <div>
                    <h3 className="font-semibold mb-3">Classificação</h3>
                    <div className="space-y-2">
                      {[5, 4, 3, 0].map(rating => (
                        <label key={rating} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="rating"
                            value={rating}
                            checked={selectedFilters.rating === rating}
                            onChange={() => handleFilterChange('rating', rating)}
                            className="mr-2"
                          />
                          <div className="flex gap-1">
                            {rating > 0 ? (
                              <>
                                {[...Array(rating)].map((_, i) => (
                                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="text-sm text-gray-700 ml-1">e acima</span>
                              </>
                            ) : (
                              <span className="text-sm text-gray-700">Todos</span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Em Estoque */}
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedFilters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Apenas em estoque</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultados */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <p className="text-gray-600">
                  Mostrando <span className="font-semibold">{filteredProducts.length}</span> produto(s)
                </p>
              </div>

              {filteredProducts.length === 0 ? (
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
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition group cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-72 object-cover group-hover:scale-105 transition duration-300"
                        />
                        <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                          <Heart size={20} className="text-gray-600" />
                        </button>
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <p className="text-white font-bold text-lg">Fora de Estoque</p>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-gray-900">
                            R$ {product.price.toFixed(2)}
                          </p>
                          <Link
                            to="/checkout"
                            disabled={!product.inStock}
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed inline-block text-center"
                          >
                            Comprar
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
