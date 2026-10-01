import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bem-vindo à Quick Sales</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90 font-light max-w-2xl mx-auto">
          Encontre os melhores produtos com os preços mais competitivos do mercado. Tudo o que você precisa em um só lugar.
        </p>
        <Link to="/produtos" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md font-semibold hover:bg-gray-300 transition duration-300 shadow-md">
          Comprar Agora
        </Link>
      </div>
    </div>
  );
}

export default Hero; 