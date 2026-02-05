import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Edit, Trash2, Plus, ArrowLeft, Search } from 'lucide-react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { toastError, toastSuccess } from '../utils/toast';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/produtos?limit=100`); // Busca até 100 produtos
      const data = await response.json();
      
      const lista = (data.data && Array.isArray(data.data)) ? data.data : (data.produtos || []);
      setProducts(lista);
    } catch (error) {
      console.error(error);
      toastError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja apagar este produto?')) {
      try {
        const response = await fetch(`${apiUrl}/api/produtos/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
          toastSuccess('Produto apagado com sucesso!');
          setProducts(products.filter(p => p.id !== id));
        } else {
          toastError(data.message || 'Erro ao apagar produto');
        }
      } catch (error) {
        console.error('Erro:', error);
        toastError('Erro de conexão com o servidor');
      }
    }
  };

  const filteredProducts = products.filter(product => 
    product.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gerenciar Produtos</h1>
          <Link to="/product-registration" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <Plus className="w-5 h-5 mr-2" />
            Novo Produto
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="p-4 border-b">ID</th>
                  <th className="p-4 border-b">Nome</th>
                  <th className="p-4 border-b">Preço</th>
                  <th className="p-4 border-b">Estoque</th>
                  <th className="p-4 border-b text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                {loading ? (
                  <tr><td colSpan="5" className="p-4 text-center">Carregando...</td></tr>
                ) : filteredProducts.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center">Nenhum produto encontrado.</td></tr>
                ) : (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 border-b last:border-none">
                      <td className="p-4">#{product.id}</td>
                      <td className="p-4 font-medium text-gray-900">{product.nome}</td>
                      <td className="p-4">MT {parseFloat(product.preco).toFixed(2)}</td>
                      <td className="p-4">{product.estoque}</td>
                      <td className="p-4 flex justify-center gap-2">
                        <Link to={`/product-edit/${product.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition" title="Editar">
                          <Edit size={18} />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition" title="Apagar">
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
      </div>
      <Footer />
    </div>
  );
};

export default AdminProducts;