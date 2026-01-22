import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, PlusCircle, Store } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        alert('Acesso restrito a administradores.');
        navigate('/');
        return;
      }
      setUser(parsedUser);
    } else {
      // Se não houver dados do usuário mas tiver token, força re-login para garantir segurança
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white shadow-lg z-10">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            Admin
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Visão Geral
          </Link>
          <Link to="/product-registration" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
            <Package className="w-5 h-5 mr-3" />
            Produtos
          </Link>
          <Link to="/orders" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 mr-3" />
            Pedidos
          </Link>
          <div className="pt-4 mt-4 border-t">
            <button onClick={handleLogout} className="flex w-full items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-500">Bem-vindo de volta, {user.nome}</p>
          </div>
          <Link to="/product-registration" className="hidden md:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
            <PlusCircle className="w-5 h-5 mr-2" />
            Novo Produto
          </Link>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Vendas Totais</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">MT 0,00</h3>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Produtos Ativos</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">--</h3>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <Link to="/product-registration" className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600">Cadastrar Produto</h4>
                <p className="text-sm text-gray-500 mt-1">Adicionar novos itens ao catálogo</p>
             </Link>
             <Link to="/" className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600">Ver Loja</h4>
                <p className="text-sm text-gray-500 mt-1">Acessar a página inicial como cliente</p>
             </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;