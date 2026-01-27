import { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(saved);
  }, []);

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300?text=Sem+Imagem';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${apiUrl}/uploads/images/${path}`;
  };

  const removeFavorite = (id) => {
    const updated = favorites.filter(item => item.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Heart className="text-red-600 fill-red-600" size={32} />
            Meus Favoritos
          </h1>

          {favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Heart size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">Você ainda não tem produtos favoritos.</p>
              <Link to="/search" className="text-blue-600 hover:text-blue-800 font-semibold mt-4 inline-block">
                Explorar Produtos
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Você tem <span className="font-semibold">{favorites.length}</span> produto(s) favoritado(s)
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(product => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                    <div className="relative overflow-hidden h-64">
                      <Link to={`/produto/${product.id}`}>
                        <img
                        src={getImageUrl(product.imagem)}
                        alt={product.nome}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                      />
                      <button
                        onClick={() => removeFavorite(product.id)}
                        className="absolute top-4 right-4 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
                      >
                        <Trash2 size={20} />
                      </button>
                      </Link>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.nome}</h3>

                      <div className="flex items-center mb-4">
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

                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm text-gray-600">Preço</p>
                          <p className="text-2xl font-bold text-gray-900">
                            Mts {parseFloat(product.preco).toFixed(2)}
                          </p>
                        </div>
                        <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                          <ShoppingCart size={18} />
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ações em Lote */}
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-4">Ações em Lote</h2>
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    <ShoppingCart size={18} />
                    Adicionar Todos ao Carrinho
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Deseja remover todos os favoritos?')) clearAllFavorites();
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 size={18} />
                    Limpar Tudo
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Favorites;
