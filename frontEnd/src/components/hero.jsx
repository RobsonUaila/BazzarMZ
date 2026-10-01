import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="relative bg-secondary overflow-hidden min-h-[90vh] flex items-center border-b border-primary">
      {/* Background Graphic Element */}
      <div className="absolute top-[-10%] right-[-5%] text-[30vw] font-display text-primary/5 leading-none select-none pointer-events-none font-bold">
        QS.
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <div className="flex flex-col justify-center py-16">
          <div className="text-accent text-sm font-bold uppercase tracking-[0.2em] mb-4">
            Nova Coleção Verão 2026
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-extrabold leading-[0.85] tracking-tighter uppercase mb-8 text-primary">
            Aura <br/>
            <span className="text-transparent" style={{ WebkitTextStroke: '2px #121212' }}>Bruta.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-light font-sans font-light mb-12 max-w-lg leading-relaxed">
            Redefina o conceito de estilo com peças que não pedem desculpas. Minimalismo com atitude.
          </p>
          
          <div className="flex gap-4">
            <Link to="/produtos" className="group relative inline-flex items-center justify-center px-10 py-5 bg-accent text-white font-display font-bold uppercase tracking-wider overflow-hidden">
              <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-primary rounded-full group-hover:w-full group-hover:h-56"></span>
              <span className="relative flex items-center gap-3">
                Explorar Coleção
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </span>
            </Link>
          </div>
        </div>

        {/* Image / Graphic Content */}
        <div className="relative h-[60vh] md:h-[80vh] w-full hidden md:block group">
          <div className="absolute inset-0 bg-primary transform -rotate-3 transition-transform duration-700 group-hover:-rotate-6 shadow-2xl"></div>
          <img 
            src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2224&auto=format&fit=crop" 
            alt="Destaque Verão" 
            className="absolute inset-0 w-full h-full object-cover transform rotate-0 transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2 shadow-2xl grayscale hover:grayscale-0"
          />
          <div className="absolute bottom-8 left-[-2rem] bg-accent text-white font-display font-bold py-3 px-6 uppercase tracking-widest text-sm transform -rotate-90 origin-bottom-left shadow-lg">
            Limitado
          </div>
        </div>

      </div>
    </div>
  );
}

export default Hero;