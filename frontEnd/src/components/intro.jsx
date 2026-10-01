import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';

function Intro() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/300?text=Sem+Imagem';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${apiUrl}/uploads/images/${path}`;
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/produtos?page=1&limit=4`);
        if (!response.ok) throw new Error('Erro ao carregar produtos');
        const data = await response.json();
        const productList = data.data || data.produtos || (Array.isArray(data) ? data : []);
        setProducts(productList.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Produtos em Destaque</h2>
          <Link to="/produtos" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            Ver Todos <span className="ml-1">&rarr;</span>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer overflow-hidden flex flex-col"
                onClick={() => navigate(`/produto/${product.id}`)}
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <img
                    src={getImageUrl(product.imagem_capa || product.imagem)}
                    alt={product.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Sem+Imagem'; }}
                  />
                  <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:bg-gray-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                  </button>
                </div>
                
                <div className="p-4 flex flex-col flex-grow">
                  <span className="text-xs text-blue-600 font-medium mb-1">{product.categoria || 'Geral'}</span>
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{product.nome}</h3>
                  
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
            <p>Nenhum produto em destaque no momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Intro;