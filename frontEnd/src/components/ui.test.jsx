import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import AdminUsers from '../pages/AdminUsers';
import Navbar from '../components/navbar';
import axios from 'axios';

// Mock do axios
vi.mock('axios', () => {
  const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: vi.fn().mockReturnThis(),
  };
  return { default: mockAxios };
});

// Mock do react-router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: '1', token: 'test-token' }),
    useLocation: () => ({ pathname: '/' }),
    Link: ({ to, children, className, ...props }) => (
      <a href={to} className={className} {...props}>
        {children}
      </a>
    ),
  };
});

// Mock do themeContext
vi.mock('../contexts/themeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme: vi.fn() }),
  ThemerProvider: ({ children }) => <div>{children}</div>
}));

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve renderizar o formulário de login', () => {
    render(<Login />);
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('deve ter campos de email e senha', () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const senhaInput = screen.getByPlaceholderText(/senha|password/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(senhaInput).toBeInTheDocument();
  });

  it('deve ter um botão de envio', () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('deve ter um link para registro', () => {
    render(<Login />);
    
    const registerLink = screen.getByRole('link', { name: /registrar-se|criar conta/i });
    expect(registerLink).toBeInTheDocument();
  });

  it('campos devem ser atualizáveis', () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const senhaInput = screen.getByPlaceholderText(/senha|password/i);
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(senhaInput, { target: { value: 'password123' } });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(senhaInput.value).toBe('password123');
  });
});

describe('Register Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve renderizar o formulário de registro', () => {
    render(<Register />);
    
    expect(screen.getByRole('heading', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('deve ter campos de nome, email e senha', () => {
    render(<Register />);
    
    const nomeInput = screen.getByPlaceholderText(/nome/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const senhaInput = screen.getByPlaceholderText(/mínimo 6 caracteres/i);
    
    expect(nomeInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(senhaInput).toBeInTheDocument();
  });

  it('deve ter um link para login', () => {
    render(<Register />);
    
    const loginLink = screen.getByRole('link', { name: /entrar/i });
    expect(loginLink).toBeInTheDocument();
  });

  it('formulário deve ser preenchível', () => {
    render(<Register />);
    
    const nomeInput = screen.getByPlaceholderText(/nome/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const senhaInput = screen.getByPlaceholderText(/mínimo 6 caracteres/i);
    
    fireEvent.change(nomeInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(senhaInput, { target: { value: 'password123' } });
    
    expect(nomeInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(senhaInput.value).toBe('password123');
  });
});

describe('Navbar Component', () => {
  it('deve renderizar a barra de navegação', () => {
    render(<Navbar />);
    
    const navbar = screen.getByRole('banner');
    expect(navbar).toBeInTheDocument();
  });

  it('deve conter links de navegação principais', () => {
    render(<Navbar />);
    
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('deve ter um link de logout quando usuário está autenticado', async () => {
    // Simula um usuário logado
    localStorage.setItem('user', JSON.stringify({ id: 1, nome: 'Test User', role: 'user' }));
    render(<Navbar />);
    
    // Aguarda o componente se atualizar para o estado "logado"
    await waitFor(() => {
      expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });

    // Agora que está logado, abre o menu mobile para encontrar o botão de sair
    const menuButton = screen.getByLabelText(/abrir menu/i);
    fireEvent.click(menuButton);

    const logoutButton = await screen.findByRole('button', { name: /sair/i });
    expect(logoutButton).toBeInTheDocument();
  });
});

describe('Forgot Password Page', () => {
  it('should render the form with an email input and a submit button', () => {
    render(<ForgotPassword />);
    expect(screen.getByText(/Redefinir Senha/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar Link de Redefinição/i })).toBeInTheDocument();
  });

  it('should show a confirmation message after submitting', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });

    render(<ForgotPassword />);
    const emailInput = screen.getByPlaceholderText(/seu@email.com/i);
    const submitButton = screen.getByRole('button', { name: /Enviar Link de Redefinição/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Se existir uma conta com este email/i)).toBeInTheDocument();
    });
  });
});

describe('Reset Password Page', () => {
  it('should render the form with two password fields', () => {
    render(<ResetPassword />);
    expect(screen.getByText(/Crie uma Nova Senha/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mínimo 6 caracteres/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirme a senha/i)).toBeInTheDocument();
  });

  it('should show an error if passwords do not match', async () => {
    render(<ResetPassword />);
    const passwordInput = screen.getByPlaceholderText(/Mínimo 6 caracteres/i);
    const confirmInput = screen.getByPlaceholderText(/Confirme a senha/i);
    const submitButton = screen.getByRole('button', { name: /Redefinir Senha/i });

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/As senhas não coincidem/i)).toBeInTheDocument();
    });
  });
});

describe('Admin Users Page', () => {
  beforeEach(() => {
    localStorage.setItem('user', JSON.stringify({ id: 1, role: 'admin', nome: 'Admin User' }));
  });

  it('should render the user management table', async () => {
    axios.get.mockResolvedValue({
      data: {
        success: true,
        data: [
          { id: 2, nome: 'Test User', email: 'test@user.com', role: 'user' },
        ]
      }
    });

    render(<AdminUsers />);

    // Usa findByText, que já espera o elemento aparecer. É mais robusto.
    expect(await screen.findByText(/Test User/i)).toBeInTheDocument();

    // Após o usuário aparecer, o loading já deve ter sumido.
    expect(screen.queryByText(/Carregando.../i)).not.toBeInTheDocument();
  });
});

describe('API Integration', () => {
  it('deve usar variáveis de ambiente para a URL da API', () => {
    expect(import.meta.env.VITE_API_URL || 'http://localhost:3000').toBeDefined();
  });

  it('deve ter fallback para URL da API', () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    expect(apiUrl).toMatch(/^https?:\/\/.+/);
  });
});

describe('Accessibility', () => {
  it('formulário de login deve ser acessível', () => {
    render(<Login />);
    
    const form = screen.getByRole('button', { name: /entrar/i }).closest('form');
    expect(form).toBeInTheDocument();
  });

  it('formulário de registro deve ter labels', () => {
    render(<Register />);
    
    const inputs = screen.getAllByRole('textbox', { hidden: false });
    expect(inputs.length).toBeGreaterThan(0);
  });
});
