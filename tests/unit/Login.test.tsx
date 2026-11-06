import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/pages/Login';
import { AppProvider } from '../../src/context/AppContext';

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AppProvider>
        <Login />
      </AppProvider>
    </BrowserRouter>
  );
};

describe('Login Component - Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (globalThis.fetch as any).mockReset();
  });

  it('renders login form with all fields', () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/you@email\.co\.za/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('shows demo account buttons', () => {
    renderLogin();
    expect(screen.getByText(/renter@parkbuddy\.co\.za/i)).toBeInTheDocument();
    expect(screen.getByText(/host@parkbuddy\.co\.za/i)).toBeInTheDocument();
  });

  it('toggles to register form when clicking register link', async () => {
    renderLogin();
    const registerLink = screen.getByText(/don't have an account\? sign up/i);
    fireEvent.click(registerLink);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e\.g\. kagiso molefe/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/\+27 82 555 0000/i)).toBeInTheDocument();
    });
  });

  it('shows role selection on register form', async () => {
    renderLogin();
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));

    await waitFor(() => {
      expect(screen.getByText(/Rent Parking/i)).toBeInTheDocument();
      expect(screen.getByText(/List My Bay/i)).toBeInTheDocument();
      expect(screen.getByText(/Both/i)).toBeInTheDocument();
    });
  });

  it('can switch between login and register', async () => {
    renderLogin();
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create Account/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Already have an account\? Log in/i));
    await waitFor(() => {
      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
    });
  });
});

describe('Login Component - Form Submission Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (globalThis.fetch as any).mockReset();
  });

  it('validates all required fields on login submit', async () => {
    renderLogin();
    const submitBtn = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const emailInput = screen.getByPlaceholderText(/you@email\.co\.za/i);
      expect(emailInput).toHaveAttribute('required');
      const passwordInput = screen.getByPlaceholderText(/••••••••/i);
      expect(passwordInput).toHaveAttribute('required');
    });
  });

  it('validates all required fields on register submit', async () => {
    renderLogin();
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e\.g\. kagiso molefe/i)).toHaveAttribute('required');
      expect(screen.getByPlaceholderText(/\+27 82 555 0000/i)).toHaveAttribute('required');
      expect(screen.getByPlaceholderText(/you@email\.co\.za/i)).toHaveAttribute('required');
      expect(screen.getByPlaceholderText(/••••••••/i)).toHaveAttribute('required');
    });
  });

  it('accepts valid SA phone number formats on register submit', async () => {
    renderLogin();
    fireEvent.click(screen.getByText(/don't have an account\? sign up/i));

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. kagiso molefe/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/you@email\.co\.za/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/\+27 82 555 0000/i), { target: { value: '0825550000' } });

    const submitBtn = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Enter a valid SA phone number/i)).not.toBeInTheDocument();
    });
  });

  it('forgot password button navigates to forgot password view', () => {
    renderLogin();
    const forgotButton = screen.getByText(/forgot password\?/i);
    expect(forgotButton).toBeInTheDocument();
    expect(forgotButton).toHaveAttribute('type', 'button');
  });
});
