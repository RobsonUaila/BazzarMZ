import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Package, ShoppingCart, LogOut, PlusCircle, Store,
  Menu, X, Sun, Moon 
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

const PartnerDashboard = () => {
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
      if (parsedUser.role !== 'partner' && parsedUser.role !== 'admin') {
        alert('Acesso restrito a parceiros e administradores.');
        navigate('/');
        return;
      }
      setUser(parsedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user && (user.role === 'partner' || user.role === 'admin')) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Buscar Vendas do Parceiro
      const ordersRes = await fetch(`${apiUrl}/api/pedidos/partner-sales`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const ordersData = await ordersRes.json();
      
      // Buscar Produtos do Parceiro
      const productsRes = await fetch(`${apiUrl}/api/produtos?limit=1000&vendedor_id=${user.id}`);
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
              borderColor: 'rgb(147, 51, 234)',
              backgroundColor: 'rgba(147, 51, 234, 0.5)',
              tension: 0.3,
            }
          ]
        });

        setStats(prev => ({ ...prev, totalSales, totalOrders: orders.length }));
      }

      const productList = (productsData.data && Array.isArray(productsData.data)) ? productsData.data : (productsData.produtos || []);
      setStats(prev => ({ ...prev, activeProducts: productList.length }));

    } catch (error) {
      console.error("Erro ao carregar dados do dashboard do parceiro", error);
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
          <h1 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            Parceiro
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/partner/dashboard" className="flex items-center px-4 py-3 bg-purple-50 text-purple-700 rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Visão Geral
          </Link>
          <Link to="/admin/products" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-purple-600 rounded-lg transition-colors">
            <Package className="w-5 h-5 mr-3" />
            Meus Produtos
          </Link>
          <Link to="/" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-purple-600 rounded-lg transition-colors">
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
            <h2 className="text-2xl font-bold text-gray-800">Dashboard de Parceiro</h2>
            <p className="text-gray-500">Acompanhe o seu desempenho e produtos.</p>
          </div>

          <Link to="/product-registration" className="hidden md:flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow-sm">
            <PlusCircle className="w-5 h-5 mr-2" />
            Novo Produto
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 p-2"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Menu Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden mb-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div className="px-4 py-3 space-y-3">
              <Link to="/partner/dashboard" className="flex items-center text-gray-700 hover:text-purple-600 py-2">
                <LayoutDashboard size={20} className="mr-3" /> Visão Geral
              </Link>
              <Link to="/admin/products" className="flex items-center text-gray-700 hover:text-purple-600 py-2">
                <Package size={20} className="mr-3" /> Meus Produtos
              </Link>
              <Link to="/product-registration" className="flex items-center text-gray-700 hover:text-purple-600 py-2">
                <PlusCircle size={20} className="mr-3" /> Novo Produto
              </Link>
              <Link to="/" className="flex items-center text-gray-700 hover:text-purple-600 py-2">
                 <Store size={20} className="mr-3" /> Ver Loja
              </Link>
              <div className="border-t border-gray-200 pt-3 space-y-2">
                <button onClick={handleLogout} className="flex items-center w-full text-red-600 hover:text-red-800 font-semibold py-2">
                  <LogOut size={18} className="mr-2" /> Sair
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
                <p className="text-sm font-medium text-gray-500">Minhas Vendas</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalSales.toLocaleString('pt-MZ', { style: 'currency', currency: 'MTS' })}</h3>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Pedidos Recebidos</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalOrders}</h3>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Meus Produtos</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.activeProducts}</h3>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <Store className="w-6 h-6" />
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
                  plugins: { legend: { position: 'top' } },
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
            <Link to="/product-registration" className="p-4 border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group">
              <h4 className="font-semibold text-gray-800 group-hover:text-purple-600">Cadastrar Produto</h4>
              <p className="text-sm text-gray-500 mt-1">Venda um novo produto na loja</p>
            </Link>

            <Link to="/admin/products" className="p-4 border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group">
              <h4 className="font-semibold text-gray-800 group-hover:text-purple-600">Meus Produtos</h4>
              <p className="text-sm text-gray-500 mt-1">Gerencie os produtos que adicionou</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PartnerDashboard;
