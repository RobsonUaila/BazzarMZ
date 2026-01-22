
// APLICAÇÃO PRINCIPAL - E-COMMERCE

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence, motion} from 'framer-motion';
import { ThemerProvider, useTheme } from './contexts/themeContext';


// IMPORTAR COMPONENTES


import Navbar from './components/navbar';
import Hero from './components/hero';
import Intro from './components/intro';
import Footer from './components/footer';


// IMPORTAR PÁGINAS

// Lazy Loading das páginas para performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProductRegistration = lazy(() => import('./pages/ProductRegistration'));
const Profile = lazy(() => import('./pages/Profile'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const Favorites = lazy(() => import('./pages/Favorites'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const PolicyPage = lazy(() => import('./pages/PolicyPage'));


// Componente que renderiza o conteúdo principal da aplicação
function AppContent() {
  const { theme } = useTheme();
  const location = useLocation(); // Essencial para AnimatePresence saber quando a rota muda

  // Define a animação de transição de página
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  // Componente de Loading simples
  const Loading = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  // Wrapper para rotas com animação (evita repetição)
  const AnimatedRoute = ({ children }) => (
    <motion.div initial="initial" animate="in" exit="exit" variants={pageVariants} transition={pageTransition}>
      {children}
    </motion.div>
  );

  return (
    <>
      <AnimatePresence mode="wait">
        <Suspense fallback={<Loading />}>
          <Routes location={location} key={location.pathname}>
            {/* ===== PÁGINA INICIAL ===== */}
            <Route
              path="/"
              element={
                <motion.div initial="initial" animate="in" exit="exit" variants={pageVariants} transition={pageTransition}>
                  <Navbar />
                  <Hero />
                  <Intro />
                  <Footer />
                </motion.div>
              }
            />

            {/* ===== PÁGINAS DE AUTENTICAÇÃO ===== */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/product-registration" element={<ProductRegistration />} />
            
            {/* ===== PÁGINAS DE PRODUTOS ===== */}
            <Route path="/produtos" element={<AnimatedRoute><ProductList /></AnimatedRoute>} />
            <Route path="/produto/:id" element={<AnimatedRoute><ProductDetail /></AnimatedRoute>} />
            
            {/* ===== PÁGINAS DE USUÁRIO ===== */}
            <Route path="/profile" element={<AnimatedRoute><Profile /></AnimatedRoute>} />
            <Route path="/favorites" element={<AnimatedRoute><Favorites /></AnimatedRoute>} />

            {/* ===== PÁGINAS DE COMPRA ===== */}
            <Route path="/search" element={<AnimatedRoute><SearchPage /></AnimatedRoute>} />
            <Route path="/checkout" element={<AnimatedRoute><Checkout /></AnimatedRoute>} />
            <Route path="/orders" element={<AnimatedRoute><Orders /></AnimatedRoute>} />

            {/* ===== PÁGINAS INFORMATIVAS ===== */}
            <Route path="/politicas" element={<PolicyPage title="Políticas de Privacidade e Envios" />} />
            <Route path="/termos" element={<PolicyPage title="Termos de Serviço" />} />
            <Route path="/ajuda" element={<PolicyPage title="Central de Ajuda (FAQ)" />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      {/* O ToastContainer agora usa o tema do contexto e fecha após 3 segundos */}
      <ToastContainer theme={theme} autoClose={3000} />
    </>
  );
}

// COMPONENTE PRINCIPAL
function App() {
  return (
    <ThemerProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemerProvider>
  );
}

export default App;
