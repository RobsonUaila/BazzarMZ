import { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock, Truck, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import { toastError } from '../utils/toast';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  useEffect(() => {
    const fetchUserOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toastError("Você precisa estar logado para ver seus pedidos.");
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/api/pedidos/my-orders`, {
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
        } 
      } catch (error) {
        console.error(error);
        toastError('Erro de conexão ao buscar pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [navigate, apiUrl]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'entregue':
        return <CheckCircle className="text-green-600" size={24} />;
      case 'processando':
        return <Clock className="text-yellow-600" size={24} />;
      case 'enviado':
        return <Truck className="text-blue-600" size={24} />;
      default:
        return <Package className="text-gray-600" size={24} />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      entregue: 'Entregue',
      processando: 'Processando',
      enviado: 'Enviado',
      pendente: 'Pendente',
      cancelado: 'Cancelado',
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      entregue: 'bg-green-100 text-green-800',
      processando: 'bg-yellow-100 text-yellow-800',
      enviado: 'bg-blue-100 text-blue-800',
      pendente: 'bg-gray-100 text-gray-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDownloadPDF = (order) => {
    const doc = new jsPDF();
    const orderId = order.id || order._id;

    // Cabeçalho da Empresa
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Azul do site
    doc.text("BazzarMZ", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Recibo de Pedido", 105, 30, null, null, "center");

    // Informações do Pedido
    doc.text(`Pedido Nº: ${orderId}`, 20, 50);
    doc.text(`Data: ${new Date(order.data_pedido).toLocaleDateString('pt-MZ')}`, 20, 60);
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, 70);
    if (order.trackingNumber) {
      doc.text(`Rastreio: ${order.trackingNumber}`, 20, 80);
    }

    // Tabela de Produtos
    const tableColumn = ["Produto", "Qtd", "Preço Unit.", "Subtotal"];
    const tableRows = [];

    (order.items || []).forEach(item => {
      const price = toNumber(item.price);
      const itemData = [
        item.name,
        item.quantity,
        `MT ${price.toFixed(2)}`,
        `MT ${(price * item.quantity).toFixed(2)}`
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      startY: 90,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] }, // Azul
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text(`Total Geral: MT ${toNumber(order.total).toFixed(2)}`, 140, finalY);

    // Rodapé
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text("Obrigado pela sua preferência!", 105, finalY + 20, null, null, "center");

    // Salvar arquivo
    doc.save(`Recibo_BazzarMZ_${orderId}.pdf`);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>
          {loading ? (
            <div className="text-center py-10">Carregando seus pedidos...</div>
          ) : orders.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">Você não fez nenhum pedido ainda.</p>
                  <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold mt-4 inline-block">
                    Continuar Comprando
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => {
                    const orderId = order.id || order._id;
                    return (
                    <div key={orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
                      {/* Header do Pedido */}
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-xl font-bold">Pedido #{orderId}</h2>
                            <p className="text-gray-600 text-sm">
                              Feito em {new Date(order.data_pedido).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {getStatusText(order.status)}
                            </div>
                          </div>
                        </div>

                        {order.trackingNumber && (
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">Código de Rastreamento:</p>
                            <p className="font-mono font-semibold">{order.trackingNumber}</p>
                          </div>
                        )}
                      </div>

                      {/* Items do Pedido */}
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="font-semibold mb-4">Produtos</h3>
                        <div className="space-y-3">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                              </div>
                              <p className="font-semibold">Mts {toNumber(item.price).toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer do Pedido */}
                      <div className="p-6 bg-gray-50 flex justify-between items-center">
                        <div>
                          <p className="text-gray-600">Total do Pedido</p>
                          <p className="text-2xl font-bold">Mts {toNumber(order.total).toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadPDF(order)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                          >
                            <FileText size={18} />
                            Ver Nota
                          </button>
                          {order.status === 'enviado' && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                              <Truck size={18} />
                              Rastrear
                            </button>
                          )}
                          {order.status === 'entregue' && (
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                              <FileText size={18} />
                              Comprar Novamente
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Timeline de Status */}
                      <div className="p-6 bg-white">
                        <h3 className="font-semibold mb-4">Histórico</h3>
                        <div className="space-y-3 text-sm">
                          {order.status === 'entregue' && (
                            <>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                <span className="text-gray-600">Entregue em 18/01/2024</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                <span className="text-gray-600">Saiu para entrega em 17/01/2024</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                <span className="text-gray-600">Pedido processado em 15/01/2024</span>
                              </div>
                            </>
                          )}
                          {order.status === 'enviado' && (
                            <>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                <span className="text-gray-600">Saiu para entrega</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                <span className="text-gray-600">Pedido processado</span>
                              </div>
                            </>
                          )}
                          {order.status === 'processando' && (
                            <>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                                <span className="text-gray-600">Processando pedido</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )
            }
          
          </div>
      </div>
      <Footer />
    </div>
  );
}

export default Orders;
