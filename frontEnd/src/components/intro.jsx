import { Heart } from 'lucide-react';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


function Intro() { 
    const navigate = useNavigate();
    const products = [
    {
      id: 1,
      name: "Camiseta Premium",
      price: 89.90,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: "Jeans Clássico",
      price: 159.90,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
      rating: 4.8,
      reviews: 94
    },
    {
      id: 3,
      name: "Tênis Esportivo",
      price: 299.90,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      rating: 4.9,
      reviews: 203
    },
    {
      id: 4,
      name: "Jaqueta de Couro",
      price: 449.90,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop",
      rating: 4.7,
      reviews: 76
    },
    {
      id: 5,
      name: "Relógio Elegante",
      price: 599.90,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      rating: 4.6,
      reviews: 145
    },
    {
      id: 6,
      name: "Mochila Urban",
      price: 189.90,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
      rating: 4.4,
      reviews: 89
    }
  ];

    return(
        <div>
            {/* Grade de Produtos */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Produtos em Destaque</h3>
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700">
            <option>Mais Relevantes</option>
            <option>Menor Preço</option>
            <option>Maior Preço</option>
            <option>Mais Vendidos</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition group cursor-pointer"
              onClick={() => navigate(`/produto/${product.id}`)}
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
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                  {product.price.toFixed(2)} Mts
                  </p>
                  <div className="text-sm text-blue-600 font-medium group-hover:underline">
                      Ver detalhes &rarr;
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
     </div>
    );

}


export default Intro;