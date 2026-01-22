import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { toastError, toastSuccess } from '../utils/toast';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function ProductRegistration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [gifList, setGifList] = useState([]);
  const [gifInput, setGifInput] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: '',
    imagem: '',
    imagem_capa: '',
    estoque: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'imagem_capa') {
      setImagePreview(value);
    }
  };

  const addGifToDescription = () => {
    if (gifInput.trim()) {
      setGifList([...gifList, gifInput.trim()]);
      setGifInput('');
      toastSuccess('GIF adicionado à descrição!');
    }
  };

  const removeGif = (index) => {
    setGifList(gifList.filter((_, i) => i !== index));
  };

  const buildDescriptionHTML = () => {
    let description = formData.descricao.replace(/\n/g, '<br />');
    
    gifList.forEach((gifUrl, index) => {
      description += `<br /><br /><img src="${gifUrl}" alt="GIF ${index + 1}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0;" />`;
    });

    return description;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toastError("Você precisa estar logado para realizar esta ação.");
        navigate('/login');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const dataToSend = {
        ...formData,
        descricao: buildDescriptionHTML()
      };

      const response = await fetch(`${apiUrl}/api/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cadastrar produto');
      }

      toastSuccess('Produto cadastrado com sucesso!');
      navigate('/admin');
    } catch (error) {
      console.error(error);
      toastError(error.message || "Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/admin" className="inline-flex items-center text-gray-600 hover:text-blue-600 transition">
              <ArrowLeft size={20} className="mr-2" />
              Voltar para Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Cadastrar Novo Produto</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nome */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ex: Camiseta Premium"
                  />
                </div>

                {/* Descrição de Texto */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição de Texto *
                  </label>
                  <textarea
                    name="descricao"
                    rows="4"
                    required
                    value={formData.descricao}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Descreva detalhes do produto, características, material, etc."
                  />
                </div>

                {/* GIFs na Descrição */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar GIFs à Descrição
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="url"
                      value={gifInput}
                      onChange={(e) => setGifInput(e.target.value)}
                      placeholder="Cole a URL do GIF (ex: https://...)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={addGifToDescription}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition"
                    >
                      <Plus size={18} />
                      Adicionar GIF
                    </button>
                  </div>

                  {gifList.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3">GIFs Adicionados:</p>
                      <div className="space-y-3">
                        {gifList.map((gif, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-300">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-600 truncate">{gif}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeGif(index)}
                              className="ml-2 p-1 text-red-500 hover:bg-red-50 rounded transition"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fotografia de Capa */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fotografia de Capa *
                  </label>
                  <input
                    type="url"
                    name="imagem_capa"
                    required
                    value={formData.imagem_capa}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  
                  {imagePreview && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Preview da Capa:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-64 w-auto rounded-lg object-cover"
                        onError={() => toastError('Erro ao carregar imagem')}
                      />
                    </div>
                  )}
                </div>

                {/* Imagem Secundária (Grid) */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Imagem para Grid (thumbnail) *
                  </label>
                  <input
                    type="url"
                    name="imagem"
                    required
                    value={formData.imagem}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://exemplo.com/thumbnail.jpg"
                  />
                </div>

                {/* Preço */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preço (MT) *
                  </label>
                  <input
                    type="number"
                    name="preco"
                    step="0.01"
                    required
                    value={formData.preco}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0.00"
                  />
                </div>

                {/* Estoque */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantidade em Estoque *
                  </label>
                  <input
                    type="number"
                    name="estoque"
                    required
                    value={formData.estoque}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="0"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    name="categoria"
                    required
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="Vestuário">Vestuário</option>
                    <option value="Calçados">Calçados</option>
                    <option value="Acessórios">Acessórios</option>
                    <option value="Eletrônicos">Eletrônicos</option>
                    <option value="Casa">Casa</option>
                    <option value="Beleza">Beleza</option>
                  </select>
                </div>
              </div>

              {/* Resumo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Resumo do Produto</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Nome: {formData.nome || 'Não preenchido'}</li>
                  <li>✓ Preço: MT{formData.preco || '0.00'}</li>
                  <li>✓ Estoque: {formData.estoque || '0'} unidades</li>
                  <li>✓ Categoria: {formData.categoria || 'Não selecionada'}</li>
                  <li>✓ GIFs adicionados: {gifList.length}</li>
                </ul>
              </div>

              {/* Botão Enviar */}
              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : (
                    <>
                      <Save size={20} className="mr-2" />
                      Publicar Produto
                    </>
                  )}
                </button>
                <Link
                  to="/admin"
                  className="flex items-center justify-center px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
                >
                  Cancelar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProductRegistration;
