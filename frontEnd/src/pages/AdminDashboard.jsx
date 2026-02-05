import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, PlusCircle, Store,
  Menu, X, Search, Heart, User, Sun, Moon 
} from 'lucide-react';
import { useTheme } from '../contexts/themeContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    activeProducts: 0
  });
  const [salesChartData, setSalesChartData] = useState({
    labels: [],
    datasets: []
  });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Buscar Pedidos (Rota de Admin)
      const ordersRes = await fetch(`${apiUrl}/api/pedidos/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      
      // Buscar Produtos
      const productsRes = await fetch(`${apiUrl}/api/produtos?limit=1000`);
      const productsData = await productsRes.json();

      if (ordersData.success) {
        const orders = ordersData.data || [];
        
        // Calcular Total de Vendas
        const totalSales = orders.reduce((acc, order) => acc + parseFloat(order.total || 0), 0);
        
        // Agrupar vendas por data para o gráfico
        const salesByDate = {};
        orders.forEach(order => {
          const date = new Date(order.data_pedido).toLocaleDateString('pt-BR');
          salesByDate[date] = (salesByDate[date] || 0) + parseFloat(order.total || 0);
        });

        // Ordenar datas
        const sortedDates = Object.keys(salesByDate).sort((a, b) => {
          const dateA = a.split('/').reverse().join('-');
          const dateB = b.split('/').reverse().join('-');
          return new Date(dateA) - new Date(dateB);
        });

        setSalesChartData({
          labels: sortedDates,
          datasets: [
            {
              label: 'Vendas (MT)',
              data: sortedDates.map(date => salesByDate[date]),
              borderColor: 'rgb(37, 99, 235)',
              backgroundColor: 'rgba(37, 99, 235, 0.5)',
              tension: 0.3,
            }
          ]
        });

        setStats(prev => ({ ...prev, totalSales, totalOrders: orders.length }));
      }

      const productList = (productsData.data && Array.isArray(productsData.data)) ? productsData.data : (productsData.produtos || []);
      setStats(prev => ({ ...prev, activeProducts: productList.length }));

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard", error);
    }
  };

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
          <Link to="/admin/products" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
            <Package className="w-5 h-5 mr-3" />
            Produtos
          </Link>
          <Link to="/admin/orders" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 mr-3" />
            Pedidos
          </Link>
          <Link to="/admin/users" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
            <Users className="w-5 h-5 mr-3" />
            Usuários
          </Link>
          <Link to="/" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
            <Store className="w-5 h-5 mr-3" />
            Ver Loja
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
            <p className="text-gray-500">Bem-vindo de volta, Mestre!</p>
          </div>

          <Link to="/product-registration" className="hidden md:flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm">
            <PlusCircle className="w-5 h-5 mr-2" />
            Novo Produto
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-2"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Menu Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden mb-6 border border-gray-200 rounded-lg bg-white dark:bg-gray-900 shadow-sm">
            <div className="px-4 py-3 space-y-3">
              <Link to="/admin/dashboard" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 py-2">
                <LayoutDashboard size={20} className="mr-3" /> Visão Geral
              </Link>
              
              <Link to="/admin/products" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 py-2">
                <Package size={20} className="mr-3" /> Produtos
              </Link>

              <Link to="/admin/orders" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 py-2">
                <ShoppingCart size={20} className="mr-3" /> Pedidos
              </Link>

              <Link to="/admin/users" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 py-2">
                <Users size={20} className="mr-3" /> Usuários
              </Link>

              <Link to="/product-registration" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-blue-600 py-2">
                <PlusCircle size={20} className="mr-3" /> Novo Produto
              </Link>

              <div className="border-t border-gray-100 dark:border-gray-700 my-2"></div>

              <Link to="/" className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">
                 <Store size={20} className="mr-3" /> Ver Loja
              </Link>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
                <button 
                  onClick={handleLogout}
                  className="flex items-center w-full text-red-600 hover:text-red-800 font-semibold py-2"
                >
                  <LogOut size={18} className="mr-2" /> Sair
                </button>
                
                <button onClick={toggleTheme} className="flex items-center w-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white py-2">
                  <span className="mr-3">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</span> Alternar Tema
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Vendas Totais</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalSales.toLocaleString('pt-MZ', { style: 'currency', currency: 'MTS' })}</h3>
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
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.activeProducts}</h3>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Desempenho de Vendas</h3>
          <div className="h-80 w-full">
            {salesChartData.labels.length > 0 ? (
              <Line 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                  },
                }} 
                data={salesChartData} 
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Sem dados de vendas para exibir
              </div>
            )}
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

            <Link to="/admin/products" className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600">Gerenciar Produtos</h4>
              <p className="text-sm text-gray-500 mt-1">Editar ou apagar produtos existentes</p>
            </Link>

            <Link to="/" className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
              <h4 className="font-semibold text-gray-800 group-hover:text-blue-600">Ver Loja</h4>
              <p className="text-sm text-gray-500 mt-1">Visualizar a loja online</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;