import { useState } from 'react';
import { Package, CheckCircle, Clock, Truck, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

function Orders() {
  const [orders] = useState([
    {
      id: 'PED001',
      date: '2024-01-15',
      status: 'entregue',
      total: 389.80,
      items: [
        { name: 'Camiseta Premium', quantity: 1, price: 89.90 },
        { name: 'Tênis Esportivo', quantity: 1, price: 299.90 },
      ],
      trackingNumber: 'BR123456789',
    },
    {
      id: 'PED002',
      date: '2024-01-10',
      status: 'processando',
      total: 159.90,
      items: [
        { name: 'Jeans Clássico', quantity: 1, price: 159.90 },
      ],
      trackingNumber: 'BR987654321',
    },
    {
      id: 'PED003',
      date: '2024-01-05',
      status: 'enviado',
      total: 189.90,
      items: [
        { name: 'Mochila Urban', quantity: 1, price: 189.90 },
      ],
      trackingNumber: 'BR456789123',
    },
  ]);

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

    // Cabeçalho da Empresa
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235); // Azul do site
    doc.text("BazzarMZ", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Recibo de Pedido", 105, 30, null, null, "center");

    // Informações do Pedido
    doc.text(`Pedido Nº: ${order.id}`, 20, 50);
    doc.text(`Data: ${new Date(order.date).toLocaleDateString('pt-MZ')}`, 20, 60);
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, 70);
    if (order.trackingNumber) {
      doc.text(`Rastreio: ${order.trackingNumber}`, 20, 80);
    }

    // Tabela de Produtos
    const tableColumn = ["Produto", "Qtd", "Preço Unit.", "Subtotal"];
    const tableRows = [];

    order.items.forEach(item => {
      const itemData = [
        item.name,
        item.quantity,
        `MT ${item.price.toFixed(2)}`,
        `MT ${(item.price * item.quantity).toFixed(2)}`
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
    doc.text(`Total Geral: MT ${order.total.toFixed(2)}`, 140, finalY);

    // Rodapé
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text("Obrigado pela sua preferência!", 105, finalY + 20, null, null, "center");

    // Salvar arquivo
    doc.save(`Recibo_BazzarMZ_${order.id}.pdf`);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Meus Pedidos</h1>

          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">Você não fez nenhum pedido ainda.</p>
              <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold mt-4 inline-block">
                Continuar Comprando
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {/* Header do Pedido */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold">Pedido #{order.id}</h2>
                        <p className="text-gray-600 text-sm">
                          Feito em {new Date(order.date).toLocaleDateString('pt-BR')}
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
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-gray-600">Quantidade: {item.quantity}</p>
                          </div>
                          <p className="font-semibold">Mts {item.price.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer do Pedido */}
                  <div className="p-6 bg-gray-50 flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Total do Pedido</p>
                      <p className="text-2xl font-bold">Mts {order.total.toFixed(2)}</p>
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
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Orders;
