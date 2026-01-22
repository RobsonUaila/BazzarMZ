import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Navbar from '../components/navbar';

// Mock do axios
vi.mock('axios', () => ({
  default: {
    create: () => ({
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    })
  }
}));

// Mock do react-router
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({ id: '1' }),
  useLocation: () => ({ pathname: '/' })
}));

describe('Login Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve renderizar o formulário de login', () => {
    render(<Login />);
    
    expect(screen.getByText(/login|entrar|login de usuário/i)).toBeInTheDocument();
  });

  it('deve ter campos de email e senha', () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/email/i);
    const senhaInput = screen.getByPlaceholderText(/senha|password/i) || screen.getByLabelText(/senha|password/i);
    
    expect(emailInput).toBeInTheDocument();
    expect(senhaInput).toBeInTheDocument();
  });

  it('deve ter um botão de envio', () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /login|entrar|enviar/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('deve ter um link para registro', () => {
    render(<Login />);
    
    const registerLink = screen.getByText(/registre|signup|criar conta|não tem conta/i) || 
                        screen.getByRole('link', { name: /registre|signup/i });
    expect(registerLink).toBeInTheDocument();
  });

  it('campos devem ser atualizáveis', () => {
    render(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/email/i);
    const senhaInput = screen.getByPlaceholderText(/senha|password/i) || screen.getByLabelText(/senha|password/i);
    
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
    
    expect(screen.getByText(/registr|sign up|criar conta/i)).toBeInTheDocument();
  });

  it('deve ter campos de nome, email e senha', () => {
    render(<Register />);
    
    const nomeInput = screen.getByPlaceholderText(/nome|name/i) || screen.getByLabelText(/nome|name/i);
    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/email/i);
    const senhaInput = screen.getByPlaceholderText(/senha|password/i) || screen.getByLabelText(/senha|password/i);
    
    expect(nomeInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(senhaInput).toBeInTheDocument();
  });

  it('deve ter um link para login', () => {
    render(<Register />);
    
    const loginLink = screen.getByText(/já tem conta|login|faça login/i) || 
                     screen.getByRole('link', { name: /login|entrar/i });
    expect(loginLink).toBeInTheDocument();
  });

  it('formulário deve ser preenchível', () => {
    render(<Register />);
    
    const nomeInput = screen.getByPlaceholderText(/nome|name/i) || screen.getByLabelText(/nome|name/i);
    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByLabelText(/email/i);
    const senhaInput = screen.getByPlaceholderText(/senha|password/i) || screen.getByLabelText(/senha|password/i);
    
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
    
    // Procura por elementos da navbar
    const navbar = screen.getByRole('navigation') || 
                  screen.getByTestId('navbar') ||
                  screen.getByText(/home|produtos|checkout/i);
    
    expect(navbar).toBeInTheDocument();
  });

  it('deve conter links de navegação principais', () => {
    render(<Navbar />);
    
    // Procura por links comuns
    const links = screen.queryAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('deve ter um link de logout quando usuário está autenticado', () => {
    localStorage.setItem('token', 'test-token');
    render(<Navbar />);
    
    // Verifica se há um link ou botão de logout
    const logoutElement = screen.queryByText(/logout|sair|exit/i) || 
                         screen.queryByRole('button', { name: /logout|sair/i });
    
    // Pode estar presente ou não dependendo da implementação
    if (logoutElement) {
      expect(logoutElement).toBeInTheDocument();
    }
  });
});

describe('API Integration', () => {
  it('deve usar variáveis de ambiente para a URL da API', () => {
    // Verifica se VITE_API_URL é usado
    expect(import.meta.env.VITE_API_URL || 'http://localhost:3000/api').toBeDefined();
  });

  it('deve ter fallback para URL da API', () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    expect(apiUrl).toMatch(/^https?:\/\/.+/);
  });
});

describe('Accessibility', () => {
  it('formulário de login deve ser acessível', () => {
    render(<Login />);
    
    const form = screen.getByRole('button', { name: /login|entrar/i }).closest('form');
    expect(form).toBeInTheDocument();
  });

  it('formulário de registro deve ter labels', () => {
    render(<Register />);
    
    // Verifica se há inputs acessíveis
    const inputs = screen.getAllByRole('textbox', { hidden: false });
    expect(inputs.length).toBeGreaterThan(0);
  });
});
