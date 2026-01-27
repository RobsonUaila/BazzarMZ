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
                const response = await fetch(`${apiUrl}/api/produtos?page=1&limit=6`);
                if (!response.ok) throw new Error('Erro ao carregar produtos');
                const data = await response.json();
                const productList = data.data || data.produtos || (Array.isArray(data) ? data : []);
                setProducts(productList);
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-lg h-96 animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Grade de Produtos */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">Produtos em Destaque</h3>
                    <Link to="/produtos" className="text-blue-600 hover:text-blue-800 font-semibold">
                        Ver Todos &rarr;
                    </Link>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
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
                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Imagem+Indisponível'; }}
                                    />
                                    <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100">
                                        <Heart size={20} className="text-gray-600" />
                                    </button>
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
                                            {parseFloat(product.preco).toFixed(2)} Mts
                                        </p>
                                        <div className="text-sm text-blue-600 font-medium group-hover:underline">
                                            Ver detalhes &rarr;
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>Nenhum produto em destaque no momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Intro;