import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit2, Save, X, ShoppingBag, Heart } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { toastError, toastSuccess } from '../utils/toast';

function Profile() {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    cidade: '',
    pais: '',
    cep: '',
  });

  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/usuarios/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Erro ao buscar perfil');
        }

        const data = await response.json();
        const profile = data.data || data;

        const formattedData = {
          nome: profile.nome || '',
          email: profile.email || '',
          telefone: profile.telefone || '',
          endereco: profile.endereco || '',
          cidade: profile.cidade || '',
          pais: profile.pais || '',
          cep: profile.cep || '',
        };

        setUserData(formattedData);
        setEditData(formattedData);
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        toastError('Erro ao carregar dados do perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, apiUrl]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${apiUrl}/api/usuarios/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editData)
      });

      const data = await response.json();

      if (response.ok) {
        setUserData(editData);
        setIsEditing(false);
        toastSuccess('Perfil atualizado com sucesso!');
        
        // Atualizar localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...user, ...editData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        throw new Error(data.message || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      toastError(error.message);
    }
  };

  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Meu Perfil</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit2 size={18} />
                  Editar
                </button>
              )}
            </div>

            {isEditing ? (
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="nome"
                        value={editData.nome}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="telefone"
                        value={editData.telefone}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={editData.cep}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="endereco"
                        value={editData.endereco}
                        onChange={handleEditChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      name="cidade"
                      value={editData.cidade}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      País
                    </label>
                    <input
                      type="text"
                      name="pais"
                      value={editData.pais}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-6">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    <Save size={18} />
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
                  >
                    <X size={18} />
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <User className="text-blue-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Nome</p>
                      <p className="font-semibold">{userData.nome}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Mail className="text-blue-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold">{userData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone className="text-blue-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-semibold">{userData.telefone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="text-blue-600" size={24} />
                    <div>
                      <p className="text-sm text-gray-600">Endereço</p>
                      <p className="font-semibold">{userData.endereco}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Localização</p>
                  <p className="font-semibold">
                    {userData.cidade}, {userData.pais} - CEP: {userData.cep}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Seção de Outras Opções */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingBag className="text-blue-600" size={24} />
                <h2 className="text-xl font-bold">Meus Pedidos</h2>
              </div>
              <Link to="/orders" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition inline-block text-center">
                Ver Pedidos
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-red-600" size={24} />
                <h2 className="text-xl font-bold">Favoritos</h2>
              </div>
              <Link to="/favorites" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition inline-block text-center">
                Ver Favoritos
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Preferências</h2>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Gerenciar Notificações
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
