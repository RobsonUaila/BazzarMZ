import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

function Intro() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop';
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
        setProducts(productList.slice(0, 4)); // Only show 4 for the editorial grid
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
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24">
        <div className="h-12 bg-primary/10 rounded w-1/4 mb-16 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-primary/5 h-[500px] animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="bg-secondary py-32 border-b border-primary/20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <h4 className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">Curadoria</h4>
            <h3 className="text-5xl md:text-7xl font-display font-extrabold uppercase tracking-tighter text-primary">
              Destaques <br/> <span className="text-transparent" style={{ WebkitTextStroke: '1px #121212' }}>Da Estação</span>
            </h3>
          </div>
          <Link to="/produtos" className="group flex items-center gap-3 font-display font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors pb-2 border-b-2 border-primary hover:border-accent">
            Ver Todos O Catálogo
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
            {products.map((product, index) => (
              <article
                key={product.id}
                className={`group cursor-pointer ${index % 2 === 1 ? 'md:mt-32' : ''}`}
                onClick={() => navigate(`/produto/${product.id}`)}
              >
                <div className="relative overflow-hidden bg-primary/5 aspect-[4/5] mb-6">
                  {/* Badge */}
                  <div className="absolute top-6 left-[-1rem] bg-accent text-secondary font-display font-bold uppercase tracking-widest py-2 px-6 text-xs z-10 shadow-lg">
                    {index === 0 ? 'N° 1' : `N° ${index + 1}`}
                  </div>
                  
                  {/* Image */}
                  <img
                    src={getImageUrl(product.imagem_capa || product.imagem)}
                    alt={product.nome}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 group-hover:-rotate-1 grayscale hover:grayscale-0"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop'; }}
                  />

                  {/* Favorite Button */}
                  <button className="absolute top-6 right-6 text-primary hover:text-accent transition-colors z-10 bg-secondary/80 p-3 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100">
                    <Heart size={20} strokeWidth={2.5} />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-sm font-bold uppercase tracking-widest text-primary/50 mb-2">Categoria</div>
                    <h4 className="font-display font-bold text-3xl text-primary uppercase tracking-tight group-hover:text-accent transition-colors">
                      {product.nome}
                    </h4>
                  </div>
                  <div className="text-right">
                    <div className="font-display font-bold text-2xl text-primary whitespace-nowrap">
                      {parseFloat(product.preco).toFixed(0)} <span className="text-sm">MTS</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-primary/10">
            <p className="font-display text-2xl text-primary/50 uppercase tracking-widest">O Catálogo está a ser atualizado.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Intro;