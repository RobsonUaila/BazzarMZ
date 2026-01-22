import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { ShoppingCart, Heart, ArrowLeft, Star } from 'lucide-react';
import { toastError, toastSuccess } from '../utils/toast';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/produtos/${id}`);
      
      if (!response.ok) {
        throw new Error('Produto não encontrado');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error(error);
      toastError('Erro ao carregar produto');
      setTimeout(() => navigate('/produtos'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      name: product.nome,
      price: product.preco,
      image: product.imagem_capa || product.imagem,
      quantity
    };
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    setInCart(true);
    toastSuccess('Adicionado ao carrinho!');
    
    setTimeout(() => setInCart(false), 2000);
  };

  const handleAddToFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (!favorites.find(fav => fav.id === product.id)) {
      favorites.push({
        id: product.id,
        name: product.nome,
        price: product.preco,
        image: product.imagem_capa || product.imagem
      });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      toastSuccess('Adicionado aos favoritos!');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-8">Produto não encontrado</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="grow container mx-auto px-4 py-8">
        {/* Voltar */}
        <div className="mb-6">
          <Link to="/produtos" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition">
            <ArrowLeft size={20} className="mr-2" />
            Voltar para Produtos
          </Link>
        </div>

        {/* Layout Principal */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12">
            
            {/* Imagem */}
            <div className="flex flex-col gap-4">
              <div className="bg-gray-100 rounded-lg overflow-hidden h-96 md:h-full flex items-center justify-center">
                {product.imagem_capa ? (
                  <img 
                    src={product.imagem_capa} 
                    alt={product.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400">Sem imagem</div>
                )}
              </div>
            </div>

            {/* Informações */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Nome e Categoria */}
                <div className="mb-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-2">
                    {product.categoria || 'Sem categoria'}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {product.nome}
                  </h1>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">4.5 (128 avaliações)</span>
                </div>

                {/* Preço */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-green-600">
                      MT{parseFloat(product.preco).toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      MT{(parseFloat(product.preco) * 1.2).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 font-semibold">Economize 20%</p>
                </div>

                {/* Estoque */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">{product.estoque || 0}</span> em estoque
                  </p>
                </div>

                {/* Descrição */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Descrição</h2>
                  <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                    {product.descricao ? (
                      <div dangerouslySetInnerHTML={{ __html: product.descricao }} />
                    ) : (
                      <p>Sem descrição disponível</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-col gap-4">
                {/* Quantidade */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-medium">Quantidade:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 font-semibold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingCart size={20} />
                    Adicionar ao Carrinho
                  </button>
                  <button
                    onClick={handleAddToFavorites}
                    className="px-6 py-3 border border-gray-300 hover:border-red-500 hover:text-red-500 rounded-lg transition"
                  >
                    <Heart size={20} />
                  </button>
                </div>

                {/* Info Entrega */}
                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 space-y-2">
                  <p>✓ Entrega grátis em Maputo</p>
                  <p>✓ Devolução em 30 dias</p>
                  <p>✓ 100% Original</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;
