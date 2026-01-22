import { useState } from 'react';
import {  X,  Heart} from 'lucide-react';
import { Star } from 'lucide-react';


function Intro() { 
     const [cart, setCart] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);



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

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const totalCart = cart.reduce((sum, item) => sum + item.price, 0);

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
              onClick={() => setSelectedProduct(product)}
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
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Barra Lateral do Carrinho */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 right-0 w-full md:w-96 bg-white shadow-2xl border-t md:border-l border-gray-200 max-h-96 overflow-y-auto z-40">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Carrinho ({cart.length})</h3>
              <button onClick={() => setCart([])} className="text-sm text-red-600 hover:underline">
                Limpar
              </button>
            </div>
            
            <div className="space-y-3 mb-4">
              {cart.map((item, index) => (
                <div key={index} className="flex items-center gap-3 pb-3 border-b">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className="text-gray-600">{item.price.toFixed(2)} Mts</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total:</span>
                <span className="text-2xl font-bold"> {totalCart.toFixed(2)} MZ</span>
              </div>
              <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition">
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal do Produto */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-3xl font-bold mb-4">{selectedProduct.name}</h2>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={20} 
                        fill={i < Math.floor(selectedProduct.rating) ? "currentColor" : "none"}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">({selectedProduct.reviews} avaliações)</span>
                </div>
                <p className="text-4xl font-bold text-gray-900 mb-6">
                  R$ {selectedProduct.price.toFixed(2)}
                </p>
                <p className="text-gray-600 mb-6">
                  Produto de alta qualidade, perfeito para o seu estilo. Disponível em várias cores e tamanhos.
                </p>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Tamanho:</label>
                  <div className="flex gap-2">
                    {['P', 'M', 'G', 'GG'].map(size => (
                      <button key={size} className="border-2 border-gray-300 px-4 py-2 rounded hover:border-black">
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition mb-4"
                >
                  Adicionar ao Carrinho
                </button>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="w-full border-2 border-gray-300 py-4 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

     </div>
    );

}


export default Intro;