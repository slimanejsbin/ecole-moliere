import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../../../components/auth/LoginForm';
import { AuthProvider } from '../../../contexts/AuthContext';
import { mockLoginCredentials } from '../../mocks/auth.mock';
import * as authHook from '../../../contexts/AuthContext';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn()
    };
});

describe('LoginForm', () => {
    const mockLogin = vi.fn();

    beforeEach(() => {
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            login: mockLogin,
            error: null,
            clearError: vi.fn(),
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
            signup: vi.fn(),
            logout: vi.fn()
        }));
    });

    it('renders login form correctly', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginForm />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginForm />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    it('validates email format', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginForm />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.input(screen.getByLabelText(/email address/i), {
            target: { value: 'invalid-email' }
        });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginForm />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.input(screen.getByLabelText(/email address/i), {
            target: { value: mockLoginCredentials.email }
        });
        fireEvent.input(screen.getByLabelText(/password/i), {
            target: { value: mockLoginCredentials.password }
        });

        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith(mockLoginCredentials);
        });
    });

    it('displays error message when login fails', async () => {
        const errorMessage = 'Invalid credentials';
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            login: mockLogin,
            error: errorMessage,
            clearError: vi.fn(),
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
            signup: vi.fn(),
            logout: vi.fn()
        }));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginForm />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('disables submit button while loading', () => {
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            login: mockLogin,
            error: null,
            clearError: vi.fn(),
            isLoading: true,
            user: null,
            token: null,
            isAuthenticated: false,
            signup: vi.fn(),
            logout: vi.fn()
        }));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <LoginForm />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
    });
});
