import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package, CheckCircle, Clock, Truck, XCircle, RefreshCw, User, Calendar, Tag,
  LayoutDashboard, ShoppingCart, LogOut, Menu, X, Store
} from 'lucide-react';
import { toastError, toastSuccess } from '../utils/toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getStatusIcon = (status) => {
    const iconMap = {
      processando: <Clock className="text-yellow-600" size={20} />,
      enviado: <Truck className="text-blue-600" size={20} />,
      entregue: <CheckCircle className="text-green-600" size={20} />,
      cancelado: <XCircle className="text-red-600" size={20} />,
    };
    return iconMap[status] || <Package className="text-gray-600" size={20} />;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      processando: 'bg-yellow-100 text-yellow-800',
      enviado: 'bg-blue-100 text-blue-800',
      entregue: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') {
      toastError("Acesso restrito a administradores.");
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [navigate, apiUrl]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/pedidos`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        toastError('Sessão expirada. Por favor, faça login novamente.');
        navigate('/login');
        return;
      }

      const data = await response.json();
      if (data.success) {
        const fetchedOrders = data.data || [];
        const validOrders = Array.isArray(fetchedOrders) ? fetchedOrders.filter(o => o && (o.id || o._id)) : [];
        setOrders(validOrders);
      } else {
        toastError(data.message || 'Erro ao buscar pedidos.');
      }
    } catch (error) {
      console.error(error);
      toastError('Erro de conexão ao buscar pedidos.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const originalOrders = [...orders];
    const updatedOrders = orders.map(o => {
      const currentId = o.id || o._id;
      return currentId === orderId ? { ...o, status: newStatus } : o;
    });
    setOrders(updatedOrders);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/pedidos/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!data.success) {
        setOrders(originalOrders);
        toastError(data.message || 'Erro ao atualizar status');
      } else {
        toastSuccess('Status do pedido atualizado!');
      }
    } catch (error) {
      console.error('Erro:', error);
      setOrders(originalOrders);
      toastError('Erro de conexão com o servidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar Administrativa */}
      <aside className="w-full md:w-64 bg-white shadow-lg z-10 hidden md:block">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            Admin
          </h1>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Visão Geral
          </Link>
          <Link to="/admin/products" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
            <Package className="w-5 h-5 mr-3" />
            Produtos
          </Link>
          <Link to="/admin/orders" className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
            <ShoppingCart className="w-5 h-5 mr-3" />
            Pedidos
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

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white shadow-sm md:hidden p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Gerenciar Pedidos</h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-600">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-b p-4 space-y-2">
            <Link to="/admin/dashboard" className="block py-2 text-gray-600">Visão Geral</Link>
            <Link to="/admin/products" className="block py-2 text-gray-600">Produtos</Link>
            <Link to="/admin/orders" className="block py-2 text-blue-600 font-medium">Pedidos</Link>
            <button onClick={handleLogout} className="block w-full text-left py-2 text-red-600">Sair</button>
          </div>
        )}

        {/* Conteúdo Principal */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Gerenciar Pedidos</h1>
            <button onClick={fetchOrders} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition" title="Atualizar lista">
              <RefreshCw size={20} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">Carregando pedidos...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-10 text-gray-500">Nenhum pedido encontrado.</div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const orderId = order.id || order._id;
                return (
                  <div key={orderId} className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderColor: getStatusColor(order.status).split(' ')[0].replace('bg', 'border') }}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <p className="font-bold text-gray-800 flex items-center gap-2"><User size={16} /> {order.nome_cliente}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2"><Tag size={16} /> Pedido #{orderId}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2"><Calendar size={16} /> {new Date(order.data_pedido).toLocaleDateString('pt-MZ')}</p>
                      </div>
                      <div className="md:col-span-1">
                        <p className="font-semibold text-lg text-green-600">MT {parseFloat(order.total).toFixed(2)}</p>
                      </div>
                      <div className="md:col-span-2 flex justify-end items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(orderId, e.target.value)}
                            className={`p-2 border-none rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                          >
                            <option value="processando">Processando</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregue">Entregue</option>
                            <option value="cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                      <p><strong>Telefone:</strong> {order.telefone}</p>
                      <p><strong>Endereço:</strong> {order.endereco}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;