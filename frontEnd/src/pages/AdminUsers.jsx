import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Trash2, RefreshCw, LayoutDashboard, Package, ShoppingCart, LogOut, Store } from 'lucide-react';
import { toastError, toastSuccess } from '../utils/toast';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/usuarios`, { withCredentials: true });
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        toastError(response.data.message || 'Erro ao buscar usuários.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Erro de conexão ao buscar usuários.';
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
      toastError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
      toastError("Acesso restrito a administradores.");
      setLoading(false);
      navigate('/login');
      return;
    }
    fetchUsers();
    // navigate is stable in production; keeping deps minimal avoids test re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  const handleRoleChange = async (userId, newRole) => {
    const originalUsers = [...users];
    const updatedUsers = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updatedUsers);

    try {
      const response = await axios.put(`${apiUrl}/api/usuarios/${userId}/role`, { role: newRole }, { withCredentials: true });
      if (response.data.success) {
        toastSuccess('Cargo do usuário atualizado!');
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      setUsers(originalUsers);
      toastError(error.message || 'Falha ao atualizar o cargo.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Tem certeza que deseja apagar este usuário? Esta ação é irreversível.')) {
      try {
        const response = await axios.delete(`${apiUrl}/api/usuarios/${userId}`, { withCredentials: true });
        if (response.data.success) {
          toastSuccess('Usuário apagado com sucesso!');
          setUsers(users.filter(u => u.id !== userId));
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        toastError(error.message || 'Falha ao apagar o usuário.');
      }
    }
  };
  
  const handleLogout = async () => {
    try {
        await axios.get(`${apiUrl}/api/usuarios/logout`, { withCredentials: true });
    } catch (error) {
        console.error("Erro ao fazer logout no servidor, procedendo com limpeza local.", error);
    } finally {
        localStorage.removeItem('user');
        navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
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
          <Link to="/admin/orders" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition-colors">
            <ShoppingCart className="w-5 h-5 mr-3" />
            Pedidos
          </Link>
          <Link to="/admin/users" className="flex items-center px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium">
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
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h2>
          <button onClick={fetchUsers} className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition" title="Atualizar lista">
            <RefreshCw size={20} />
          </button>
        </header>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="p-4 border-b">ID</th>
                  <th className="p-4 border-b">Nome</th>
                  <th className="p-4 border-b">Email</th>
                  <th className="p-4 border-b">Cargo</th>
                  <th className="p-4 border-b text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {loading ? (
                  <tr><td colSpan="5" className="p-4 text-center">Carregando...</td></tr>
                ) : users.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center">Nenhum usuário encontrado.</td></tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 border-b last:border-none">
                      <td className="p-4">#{user.id}</td>
                      <td className="p-4 font-medium text-gray-900">{user.nome}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className={`p-2 border-none rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="user">Usuário</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Apagar Usuário">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
