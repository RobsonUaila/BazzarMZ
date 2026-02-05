import { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Truck, AlertCircle, CheckCircle2, Phone, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { toastError, toastSuccess } from '../utils/toast';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) navigate('/produtos');
    setCartItems(savedCart);
  }, []);

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/100?text=Sem+Imagem';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    return `${apiUrl}/uploads/images/${path}`;
  };
  
  const [formData, setFormData] = useState({
    Nome_do_Cliente: '',
    numero_chamadas: '',
    endereco_completo: '',
    confirmacao: false,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.preco * item.quantity), 0);
  const shipping = 0; // Entrega sempre grátis
  const total = subtotal + shipping;

  const removeItem = (indexToRemove) => {
    const newCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Limpar erro quando usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if(!formData.Nome_do_Cliente.trim()) {
      newErrors.Nome_do_Cliente = 'Nome é obrigatório';
    }
    
    if (!formData.numero_chamadas.trim()) {
      newErrors.numero_chamadas = 'Número de chamadas é obrigatório';
    } else if (!/^\+?[0-9\s\-()]{9,9}$/.test(formData.numero_chamadas)) {
      newErrors.numero_chamadas = 'Número inválido (maximo 9 dígitos)';
    }

    if (!formData.endereco_completo.trim()) {
      newErrors.endereco_completo = 'Endereço é obrigatório';
    } else if (formData.endereco_completo.length < 10) {
      newErrors.endereco_completo = 'Endereço muito curto';
    }

    if (!formData.confirmacao) {
      newErrors.confirmacao = 'Você deve confirmar que deseja adquirir o produto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendToWhatsApp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // 1. Salvar pedido no banco de dados
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toastError("Você precisa estar logado para fazer um pedido.");
        return;
      }

      // SEGURANÇA: O Backend deve recalcular este total baseando-se nos IDs dos itens.
      // Confiar no total enviado pelo frontend permite manipulação de preços.
      if (total <= 0) {
        toastError("Erro no cálculo do pedido.");
        return;
      }

      const orderData = {
        items: cartItems,
        total: total,
        nome_cliente: formData.Nome_do_Cliente,
        telefone: formData.numero_chamadas,
        endereco: formData.endereco_completo,
      };

      const response = await fetch(`${apiUrl}/api/pedidos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (!result.success) throw new Error(result.message || 'Falha ao criar pedido');

      toastSuccess('Pedido registado no sistema!');
    } catch (error) {
      toastError(error.message || 'Não foi possível registar o pedido.');
      return; // Não continuar se o registo falhar
    }

    // Construir mensagem para WhatsApp
    const produtosLista = cartItems
      .map(item => `- ${item.nome} (Qtd: ${item.quantity}) -  ${(item.preco * item.quantity).toFixed(2)} Mts`)
      .join('\n');

    const mensagem = `*🛍️ NOVO PEDIDO*

*Nome do Cliente:*
${formData.Nome_do_Cliente}

*Número de Chamadas:*
${formData.numero_chamadas}

*Endereço de Entrega:*
${formData.endereco_completo}

*Produtos:*
${produtosLista}

*Resumo do Pedido:*
Subtotal:  ${subtotal.toFixed(2)} Mts
Entrega: ${shipping === 0 ? 'Grátis' : `${shipping.toFixed(2)} Mts`}
*Total: ${total.toFixed(2)} Mts*

*Método de Pagamento:* Dinheiro na Entrega!
*Status:* Aguardando Confirmação`;

    // Número de WhatsApp da loja (adicione seu número aqui)
    const numeroWhatsApp = 'https://wa.me/258835130967'; // Substitua pelo número real da loja

    // Codificar mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);

    // Abrir WhatsApp
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    window.open(urlWhatsApp, '_blank');

    // Mostrar confirmação
    setSubmitted(true);
    localStorage.removeItem('cart'); // Limpar carrinho
    
    // Resetar formulário após 3 segundos
    setTimeout(() => {
      setFormData({
        Nome_do_Cliente: '', 
        numero_chamadas: '',
        endereco_completo: '',
        confirmacao: false,
      });
      setSubmitted(false);
      navigate('/orders'); // Leva para a página de pedidos
    }, 3000);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout - Pagamento na Entrega</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formulário COD */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold text-green-600 mb-2">Pedido Enviado!</h2>
                  <p className="text-gray-600 mb-4">
                    Suas informações foram enviadas para WhatsApp. Aguarde o retorno da loja.
                  </p>
                  <Link to="/search" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                    Continuar Comprando
                  </Link>
                </div>
              ) : (
                <form onSubmit={sendToWhatsApp} className="space-y-6">
                  {/* Informações de Pagamento COD */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertCircle size={20} className="text-orange-600" />
                      <div>
                        <h3 className="font-bold text-orange-900">Dinheiro na Entrega! </h3>
                        <p className="text-sm text-orange-800">Você pagará ao receber o produto</p>
                      </div>
                    </div>
                  </div>

                  {
                    /* Nome do Cliente */  
                  }

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Nome do Cliente</h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo
                      </label>                      <input
                        type="text"
                        name="Nome_do_Cliente"
                        value={formData.Nome_do_Cliente}
                        onChange={handleInputChange}
                        placeholder="Ex: João da Silva"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base ${    
                          errors.Nome_do_Cliente ? 'border-red-500' : 'border-gray-300'                
                        }`}                
                      />
                        {errors.Nome_do_Cliente && (
                          <p className="text-red-500 text-sm mt-1">{errors.Nome_do_Cliente}</p>
                        )}
                    </div>
                  </div>


                  {/* Número de Chamadas */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Phone size={24} />
                      Número de Chamadas
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número para Contato
                      </label>
                      <input
                        type="tel"
                        name="numero_chamadas"
                        value={formData.numero_chamadas}
                        onChange={handleInputChange}
                        placeholder="Ex: +258 84 123 4567"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base ${
                          errors.numero_chamadas ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.numero_chamadas && (
                        <p className="text-red-500 text-sm mt-1">{errors.numero_chamadas}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-2">
                        Esse número será usado para confirmar e atualizar sobre seu pedido
                      </p>
                    </div>
                  </div>

                  {/* Endereço de Entrega */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MapPin size={24} />
                      Endereço de Entrega
                    </h2>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço Completo
                      </label>
                      <textarea
                        name="endereco_completo"
                        value={formData.endereco_completo}
                        onChange={handleInputChange}
                        placeholder="Ex: Rua das Flores, Nº 123, Apto 45, Bairro Centro, Maputo, Gaza"
                        rows="4"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base ${
                          errors.endereco_completo ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.endereco_completo && (
                        <p className="text-red-500 text-sm mt-1">{errors.endereco_completo}</p>
                      )}
                      <p className="text-gray-500 text-sm mt-2">
                        Inclua rua, número, complemento, bairro, cidade e província
                      </p>
                    </div>
                  </div>

                  {/* Confirmação */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Confirmação</h2>
                    <label className="flex items-start gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        name="confirmacao"
                        checked={formData.confirmacao}
                        onChange={handleInputChange}
                        className="w-5 h-5 rounded accent-blue-600 shrink-0"
                      />
                      <span className="text-gray-700">
                        <span className="font-semibold">Confirmo que desejo adquirir este(s) produto(s)</span>
                        <br />
                        <span className="text-sm text-gray-600">
                          Autorizo o envio das minhas informações para WhatsApp e concordo em receber atualizações sobre meu pedido
                        </span>
                      </span>
                    </label>
                    {errors.confirmacao && (
                      <p className="text-red-500 text-sm mt-2">{errors.confirmacao}</p>
                    )}
                  </div>

                  {/* Botões */}
                  <div className="space-y-2">
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition text-lg flex items-center justify-center gap-2"
                    >
                      <Truck size={20} />
                      Enviar Pedido via WhatsApp
                    </button>
                    <Link to="/search" className="block text-center text-gray-600 hover:text-gray-800 py-2 rounded-lg hover:bg-gray-100 transition">
                      ← Continuar Comprando
                    </Link>
                  </div>
                </form>
              )}
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Resumo do Pedido
                </h2>

                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto border-b pb-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm group">
                      <div className="flex gap-2 flex-1 min-w-0">
                        <img src={getImageUrl(item.imagem)} alt={item.nome} className="w-12 h-12 object-cover rounded" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 truncate">{item.nome}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-xs">Qtd: {item.quantity}</p>
                            <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 transition" title="Remover item">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900"> {(item.preco * item.quantity).toFixed(2)} Mts</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold"> {subtotal.toFixed(2)} Mts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Entrega:</span>
                    <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? 'Grátis' : `${shipping.toFixed(2)} Mts`}
                    </span>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">{total.toFixed(2)} Mts</span>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
                  <p className="font-semibold mb-1">💰 Pagamento na Entrega</p>
                  <p>Você pagará em dinheiro ao receber o produto</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 mt-3">
                  <p className="font-semibold mb-1">🎉 Entrega Grátis!</p>
                  <p>Aproveite a nossa entrega gratuita para todos os pedidos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
