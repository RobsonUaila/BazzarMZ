import { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Truck, AlertCircle, CheckCircle2, Phone, Trash2, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { toastError, toastSuccess } from '../utils/toast';

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      navigate('/produtos');
    } else {
      setCartItems(savedCart.map(item => ({ ...item, quantity: item.quantity || 1 })));
    }
  }, [navigate]);

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.preco) * item.quantity), 0);
  const shipping = 0; // Entrega Grátis
  const total = subtotal + shipping;

  const removeItem = (indexToRemove) => {
    const newCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    if (newCart.length === 0) navigate('/produtos');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Nome_do_Cliente.trim()) {
      newErrors.Nome_do_Cliente = 'O nome é obrigatório.';
    }

    if (!formData.numero_chamadas.trim()) {
      newErrors.numero_chamadas = 'O número de telemóvel é obrigatório.';
    } else if (formData.numero_chamadas.replace(/[^0-9]/g, '').length < 9) {
      newErrors.numero_chamadas = 'Insira um número válido (mínimo 9 dígitos).';
    }

    if (!formData.endereco_completo.trim()) {
      newErrors.endereco_completo = 'O endereço é obrigatório.';
    } else if (formData.endereco_completo.length < 10) {
      newErrors.endereco_completo = 'Por favor, insira um endereço mais detalhado.';
    }

    if (!formData.confirmacao) {
      newErrors.confirmacao = 'Tem de confirmar o pedido para prosseguir.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendToWhatsApp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toastError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem('token');
    
    // Tentar gravar na Base de Dados se o utilizador estiver logado
    if (token && total > 0) {
      try {
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

        if (response.ok) {
          toastSuccess('Pedido registado com sucesso na sua conta!');
        }
      } catch (error) {
        console.error("Erro ao registar na BD:", error);
        // Continuamos para o WhatsApp mesmo se a BD falhar
      }
    }

    // Construir mensagem do WhatsApp
    const produtosLista = cartItems
      .map(item => `▪️ ${item.nome} (Qtd: ${item.quantity}) - ${(parseFloat(item.preco) * item.quantity).toFixed(2)} Mts`)
      .join('\n');

    const mensagem = `*🛒 NOVO PEDIDO - QUICK SALES*

*👤 Dados do Cliente*
Nome: ${formData.Nome_do_Cliente}
Telefone: ${formData.numero_chamadas}

*📍 Morada de Entrega*
${formData.endereco_completo}

*📦 Produtos*
${produtosLista}

*💰 Resumo*
Subtotal: ${subtotal.toFixed(2)} Mts
Entrega: ${shipping === 0 ? 'Grátis' : `${shipping.toFixed(2)} Mts`}
*Total a Pagar: ${total.toFixed(2)} Mts*

*💳 Método de Pagamento:* Dinheiro na Entrega`;

    const numeroWhatsApp = '258835130967'; // O seu número
    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;
    
    window.open(urlWhatsApp, '_blank');

    setSubmitted(true);
    localStorage.removeItem('cart');
    setCartItems([]);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Encomenda</h1>
        <p className="text-gray-500 mb-8">Preencha os seus dados para receber os produtos em casa.</p>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Coluna Principal: Formulário */}
          <div className="lg:col-span-2 space-y-6">
            {submitted ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
                <CheckCircle2 size={64} className="mx-auto text-green-500 mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Pedido Enviado!</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  A sua encomenda foi reencaminhada para o nosso WhatsApp. 
                  A nossa equipa irá responder-lhe em breve para confirmar a entrega.
                </p>
                <Link to="/produtos" className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-md hover:bg-blue-700 transition shadow-sm">
                  Continuar a Comprar
                </Link>
              </div>
            ) : (
              <form onSubmit={sendToWhatsApp} className="space-y-6">
                
                {/* Alerta Pagamento */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                  <div>
                    <h3 className="font-semibold text-blue-900">Pagamento no Ato da Entrega</h3>
                    <p className="text-sm text-blue-800 mt-1">
                      Não precisa de pagar nada agora. O pagamento será feito em numerário quando receber os produtos na sua morada.
                    </p>
                  </div>
                </div>

                {/* Bloco: Dados Pessoais */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User size={20} className="text-blue-600" />
                    Dados Pessoais
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <input
                        type="text"
                        name="Nome_do_Cliente"
                        value={formData.Nome_do_Cliente}
                        onChange={handleInputChange}
                        placeholder="Ex: João da Silva"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.Nome_do_Cliente ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.Nome_do_Cliente && <p className="text-red-500 text-xs mt-1">{errors.Nome_do_Cliente}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de Telemóvel</label>
                      <input
                        type="tel"
                        name="numero_chamadas"
                        value={formData.numero_chamadas}
                        onChange={handleInputChange}
                        placeholder="Ex: 84 123 4567"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.numero_chamadas ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.numero_chamadas && <p className="text-red-500 text-xs mt-1">{errors.numero_chamadas}</p>}
                    </div>
                  </div>
                </div>

                {/* Bloco: Morada */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    Morada de Entrega
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                    <textarea
                      name="endereco_completo"
                      value={formData.endereco_completo}
                      onChange={handleInputChange}
                      placeholder="Ex: Av. 24 de Julho, Prédio X, 2º Andar, Maputo"
                      rows="3"
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none ${errors.endereco_completo ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.endereco_completo && <p className="text-red-500 text-xs mt-1">{errors.endereco_completo}</p>}
                  </div>
                </div>

                {/* Confirmação */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="confirmacao"
                      checked={formData.confirmacao}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold block mb-1">Confirmo a exatidão dos dados e a intenção de compra.</span>
                      <span className="text-gray-500">
                        Ao prosseguir, serei redirecionado para o WhatsApp da loja para concluir o pedido.
                      </span>
                    </div>
                  </label>
                  {errors.confirmacao && <p className="text-red-500 text-xs mt-2 ml-7">{errors.confirmacao}</p>}
                </div>

                {/* Botões */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#25D366] text-white py-4 rounded-md font-bold hover:bg-[#128C7E] transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-70"
                  >
                    <Truck size={20} />
                    {isSubmitting ? 'A processar...' : 'Concluir Encomenda via WhatsApp'}
                  </button>
                  <Link to="/produtos" className="text-center text-blue-600 hover:text-blue-800 text-sm font-medium py-2">
                    Voltar aos produtos
                  </Link>
                </div>
              </form>
            )}
          </div>

          {/* Coluna Lateral: Resumo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                <ShoppingCart size={20} className="text-blue-600" />
                O Seu Pedido
              </h2>

              {cartItems.length > 0 ? (
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-sm">
                      <div className="flex gap-3 flex-1 min-w-0">
                        <div className="w-16 h-16 shrink-0 bg-gray-100 rounded border border-gray-200 overflow-hidden">
                          <img src={getImageUrl(item.imagem)} alt={item.nome} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 line-clamp-2 leading-tight mb-1">{item.nome}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-xs">Qtd: {item.quantity}</span>
                            {!submitted && (
                              <button onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 transition">
                                Remover
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 ml-2 whitespace-nowrap">
                        {(parseFloat(item.preco) * item.quantity).toFixed(2)} Mts
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-6 italic">O seu carrinho está vazio.</p>
              )}

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">{subtotal.toFixed(2)} Mts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Envio</span>
                  <span className="font-medium text-green-600">Grátis</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">{total.toFixed(2)} Mts</span>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">Impostos incluídos</p>
              </div>
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Checkout;
