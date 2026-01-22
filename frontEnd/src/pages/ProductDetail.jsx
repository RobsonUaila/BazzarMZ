import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { ShoppingCart, Heart, ArrowLeft, Star, MessageCircle, ThumbsUp } from 'lucide-react';
import { toastError, toastSuccess } from '../utils/toast';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProduct();
    checkIfFavorite();
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
      fetchReviews();
      fetchRelatedProducts(data.categoria);
    } catch (error) {
      console.error(error);
      toastError('Erro ao carregar produto');
      setTimeout(() => navigate('/produtos'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/produtos/${id}/reviews`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Erro ao carregar reviews:', error);
    }
  };

  const fetchRelatedProducts = async (categoria) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/produtos?categoria=${categoria}&limit=4`);
      if (response.ok) {
        const data = await response.json();
        const filtered = (data.produtos || data).filter(p => p.id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (error) {
      console.error('Erro ao carregar produtos relacionados:', error);
    }
  };

  const checkIfFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some(fav => fav.id == id));
  };

  const handleAddToCart = () => {
    const cartItem = {
      id: product.id,
      nome: product.nome,
      preco: product.preco,
      imagem: product.imagem_capa || product.imagem,
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
    
    if (isFavorite) {
      const updated = favorites.filter(fav => fav.id != product.id);
      localStorage.setItem('favorites', JSON.stringify(updated));
      setIsFavorite(false);
      toastSuccess('Removido dos favoritos');
    } else {
      favorites.push({
        id: product.id,
        nome: product.nome,
        preco: product.preco,
        imagem: product.imagem_capa || product.imagem
      });
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toastSuccess('Adicionado aos favoritos!');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      toastError('Por favor, escreva um comentário');
      return;
    }

    setSubmittingReview(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${apiUrl}/api/produtos/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newReview)
      });

      if (response.ok) {
        toastSuccess('Review enviado com sucesso!');
        setNewReview({ rating: 5, comment: '' });
        fetchReviews();
      } else {
        toastError('Erro ao enviar review');
      }
    } catch (error) {
      console.error('Erro ao enviar review:', error);
      toastError('Erro ao conectar com o servidor');
    } finally {
      setSubmittingReview(false);
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

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/produtos" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition">
            <ArrowLeft size={20} className="mr-2" />
            Voltar para Produtos
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12">
            {/* Imagem (Criativo) - Sticky para acompanhar a descrição */}
            <div className="flex flex-col gap-4 sticky top-24 h-fit">
              <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square flex items-center justify-center relative group">
                {product.imagem_capa ? (
                  <img 
                    src={product.imagem_capa} 
                    alt={product.nome}
                    className="w-full h-full object-contain hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="text-gray-400">Sem imagem</div>
                )}
                {/* Badge de Zoom/Visualização */}
                <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition">
                  Visualizar Criativo
                </div>
              </div>
            </div>

            {/* Informações */}
            <div className="flex flex-col justify-between">
              <div>
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
                        className={i < Math.floor(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">{avgRating} ({reviews.length} avaliações)</span>
                </div>

                {/* Preço */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-green-600">
                      MT{parseFloat(product.preco).toFixed(2)}
                    </span>
                  </div>
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
                  <div className="text-gray-700 leading-relaxed prose prose-blue max-w-none">
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
                    className={`px-6 py-3 rounded-lg transition font-semibold flex items-center gap-2 ${
                      isFavorite
                        ? 'bg-red-500 text-white'
                        : 'border border-gray-300 text-gray-700 hover:border-red-500'
                    }`}
                  >
                    <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                    {isFavorite ? 'Favorito' : 'Adicionar'}
                  </button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-700 space-y-2">
                  <p>✓ Entrega grátis em Maputo</p>
                  <p>✓ Devolução em 30 dias</p>
                  <p>✓ 100% Original</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MessageCircle size={24} />
            Avaliações ({reviews.length})
          </h2>

          {/* Form de Review */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Deixe sua avaliação</h3>
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Classificação (1-5 estrelas)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="transition"
                    >
                      <Star
                        size={24}
                        className={star <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seu comentário
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="O que você achou do produto?"
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
              >
                {submittingReview ? 'Enviando...' : 'Enviar Avaliação'}
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nenhuma avaliação ainda. Seja o primeiro!</p>
            ) : (
              reviews.map((review, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{review.usuario_nome || 'Anônimo'}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {review.data_criacao ? new Date(review.data_criacao).toLocaleDateString('pt-MZ') : 'Recentemente'}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comentario || review.comment}</p>
                  {review.helpful > 0 && (
                    <div className="mt-3 flex items-center gap-1 text-sm text-gray-600">
                      <ThumbsUp size={14} />
                      {review.helpful} pessoas acharam útil
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Produtos Relacionados */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relProd => (
                <Link
                  key={relProd.id}
                  to={`/produto/${relProd.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition group"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img
                      src={relProd.imagem_capa || relProd.imagem}
                      alt={relProd.nome}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
                      {relProd.nome}
                    </h3>
                    <p className="text-lg font-bold text-green-600">
                      MT{parseFloat(relProd.preco).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ProductDetail;
