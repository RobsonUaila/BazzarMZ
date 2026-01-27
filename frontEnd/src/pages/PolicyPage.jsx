import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const PolicyPage = ({ content }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        setTimeout(() => element.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Politicas de Privacidade</h1>
          <div className="prose prose-blue max-w-none text-gray-700">
            {content ? (
              <div dangerouslySetInnerHTML={{ __html: content }} />
            ) : (
              <>
                <p className="mb-4">


                  A sua privacidade é importante para nós. Esta Política de Privacidade descreve como coletamos, utilizamos e protegemos as informações pessoais dos utilizadores ao acessar e utilizar o nosso site.
                </p>

                <h3 className="text-xl font-semibold mb-4 mt-4">1. Informações coletadas</h3>
                <p className="mb-4">
                  Podemos coletar as seguintes informações:
                </p>

                <ul className='list-disc pl-5'>
                  <li>Nome Completo</li>
                  <li>Endereço de e-mail</li>
                  <li>Numero de Telefone</li>
                  <li>Endereço de entrega</li>

                </ul>

                <h3 className="text-xl font-semibold mb-4 mt-4">2. Uso das Informações</h3>
                <p className="mb-4">
                  As informações coletadas são utilizadas para:
                </p>

                <ul className='list-disc pl-5'>
                  <li>Processar pedidos e pagamentos</li>
                  <li>Gerir entregas e devoluções</li>
                  <li>Comunicar Promoções, ofertas e novidades</li>
                  <li>Melhorar experiencia de utilizador</li>
                </ul>


                <h3 className="text-xl font-semibold mb-4 mt-4">3. Proteção dos dados</h3>
                <p className="mb-4">
                  Adotamos medidas técnicas e organizacionais adequadas para proteger os dados pessoais contra acessos não autorizados, perda ou divulgação indevida.
                </p>


                <h3 className="text-xl font-semibold mb-4 mt-4">4. Compartilhação dos dados </h3>
                <p className="mb-4">
                  Não vendemos nem partilhamos dados pessoais com terceiros, exceto quando necessário para:
                </p>

                <ul className='list-disc pl-5'>
                  <li>Processar pagamentos</li>
                  <li>Cumprimento de obrigações legais</li>
                  <li>Serviços de Entregas</li>
                </ul>


                <h1 id='termos' className="text-3xl font-bold text-gray-900 mt-4 mb-6">Termos e Condições</h1>
                <p className="mb-4">
                  Ao aceder e utilizar este site, concorda em cumprir os seguintes termos e condições:
                </p>

                <h3 className="text-xl font-semibold mb-4 mt-4">1. Uso do Site</h3>
                <p className="mb-4">
                  O site destina-se exclusivamente para uso pessoal e não comercial. É proibida a utilização indevida, fraudulenta ou ilegal da plataforma.
                </p>

                <h3 className="text-xl font-semibold mb-4 mt-4">2. Conta do utilizador</h3>
                <p className='mb-4'>O utilizador é responsável por manter a confidencialidade das suas credenciais de acesso e por todas as atividades realizadas na sua conta.</p>

                <h3 className="text-xl font-semibold mb-4 mt-4">3. Produtos e Preços</h3>
                <p className="mb-4">Os preços, descrições e disponibilidade dos produtos podem ser alterados sem aviso prévio. Reservamo-nos o direito de corrigir erros de preços ou informações incorretas.</p>

                <h3 className="text-xl font-semibold mb-4 mt-4">4. Pagamentos</h3>
                <p className='mb-4'>Os pagamentos são processados no acto da entrega.</p>

                <h3 className='text-xl font-semibold mb-4 mt-4'>5. Responsabilidade</h3>
                <p className='mb-4'>O site não se responsabiliza por danos diretos, indiretos, incidentais ou consequenciais decorrentes do uso ou impossibilidade de uso do site.</p>

                <h1 id='cookies' className="text-3xl font-bold text-gray-900 mt-4 mb-6">Política de Cookies</h1>
                <p className="mb-4">Utilizamos cookies para melhorar a sua experiência no nosso site. Ao continuar a navegar, você concorda com o uso de cookies conforme descrito na nossa Política de Cookies.</p>
                <h3 className='text-xl font-semibold mb-4 mt-4'>O que são cookies?</h3>

                <p className='mb-4'>Cookies são pequenos ficheiros armazenados no seu dispositivo que ajudam a reconhecer preferências e melhorar a navegação.</p>

                <p className='mb-4 font-semibold'>Tipos de cookies utilizados

                </p>

                <ul className='list-disc pl-5'>
                  <li>Cookies essenciais: necessários para o funcionamento do site</li>
                  <li>Cookies de desempenho: ajudam a analisar o uso do site</li>
                  <li>Cookies de funcionalidade: lembram preferências do utilizador</li>
                </ul>


                <h1 className='text-3xl font-bold text-gray-900 mt-4 mb-6'> ENVIO, TROCAS E DEVOLUÇÕES</h1>

                <h2 id='envios' className='text-xl font-semibold mb-4 mt-4' >Envio</h2>

                <ul className='list-disc pl-5'>
                  <li>Os pedidos são processados após a confirmação do pagamento</li>
                  <li>O prazo de entrega varia conforme a localização do cliente</li>
                  <li>O custo do envio será informado antes da finalização da compra</li>
                </ul>


                <h3 id='devo' className='text-xl font-semibold mb-4 mt-6'>Trocas e Devoluções </h3>

                <p className='mb-4'>O cliente pode solicitar troca ou devolução nas seguintes condições:</p>


                <p className='mb-4'>1. Prazo</p>

                <ul className='list-disc pl-5'>
                  <li>Até 7 dias após o recebimento do produto</li>
                </ul>

                <p className='mb-4 mt-4'>2. Condições</p>

                <ul className='list-disc pl-5'>
                  <li>Produto sem sinais de uso</li>
                  <li>Embalagem original</li>
                  <li>Acompanhado do comprovativo de compra</li>
                </ul>

                <p className='mb-4 mt-4'>3. Produtos com defeito</p>

                <ul className='list-disc pl-5'>
                  <li>Caso o produto apresente defeito, o cliente deve entrar em contacto imediatamente para análise e substituição
                  </li>
                </ul>

               <h1 id='garantia' className="text-3xl font-bold text-gray-900 mt-4 mb-6">GARANTIA</h1>

               <p className='mb-4'>Todos os produtos comercializados estão cobertos por garantia legal, conforme a legislação aplicável.</p>

                <p className='mb-4 font-semibold'>Condições da garantia:</p>

                <ul className='list-disc pl-5'>
                  <li>A garantia cobre defeitos de fabrico</li>
                  <li>Não cobre danos causados por uso indevido, quedas ou mau manuseio</li>
                  <li>O prazo de garantia varia conforme o produto e será informado na descrição</li>
                </ul>

                <p className='mb-4 mt-2'>Para acionar a garantia, o cliente deve apresentar o comprovativo de compra.</p>
              </>

            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PolicyPage;