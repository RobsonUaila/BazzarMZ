import { Link } from 'react-router-dom';

function Hero() {
    return (
       <div className="bg-linear-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Coleção Verão 2026</h2>
          <p className="text-xl mb-8 opacity-90">Até 50% de desconto em peças selecionadas</p>
          <Link to="/produtos" className="inline-block bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 hover:text-purple-700 transition duration-300">
            Comprar Agora
          </Link>
        </div>
      </div>
    );
}

export default Hero;