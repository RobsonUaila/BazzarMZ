import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { Package, Plus, Users, DollarSign } from 'lucide-react';

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Painel Administrativo</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Cards de Estatísticas */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center border border-gray-100">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total de Produtos</p>
              <p className="text-2xl font-bold text-gray-800">124</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center border border-gray-100">
            <div className="p-3 bg-green-100 rounded-full mr-4">
              <DollarSign className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Vendas Hoje</p>
              <p className="text-2xl font-bold text-gray-800">R$ 1.250,00</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center border border-gray-100">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Novos Clientes</p>
              <p className="text-2xl font-bold text-gray-800">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Gerenciamento</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/produtos/novo" className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group cursor-pointer">
              <Plus className="text-gray-400 group-hover:text-blue-500 mb-2" size={32} />
              <span className="text-gray-600 group-hover:text-blue-600 font-medium">Cadastrar Produto</span>
            </Link>
            {/* Você pode adicionar mais cards de ação aqui */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;