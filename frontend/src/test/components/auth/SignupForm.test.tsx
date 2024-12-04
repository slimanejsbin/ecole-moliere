import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SignupForm from '../../../components/auth/SignupForm';
import { AuthProvider } from '../../../contexts/AuthContext';
import { mockSignupData } from '../../mocks/auth.mock';
import * as authHook from '../../../contexts/AuthContext';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn()
    };
});

describe('SignupForm', () => {
    const mockSignup = vi.fn();

    beforeEach(() => {
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            signup: mockSignup,
            error: null,
            clearError: vi.fn(),
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
            login: vi.fn(),
            logout: vi.fn()
        }));
    });

    it('renders signup form correctly', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <SignupForm />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <SignupForm />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
            expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
        });
    });

    it('validates password match', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <SignupForm />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.input(screen.getByLabelText(/^password/i), {
            target: { value: 'password123' }
        });
        fireEvent.input(screen.getByLabelText(/confirm password/i), {
            target: { value: 'different-password' }
        });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/the passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('submits form with valid data', async () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <SignupForm />
                </AuthProvider>
            </BrowserRouter>
        );

        fireEvent.input(screen.getByLabelText(/first name/i), {
            target: { value: mockSignupData.firstName }
        });
        fireEvent.input(screen.getByLabelText(/last name/i), {
            target: { value: mockSignupData.lastName }
        });
        fireEvent.input(screen.getByLabelText(/email address/i), {
            target: { value: mockSignupData.email }
        });
        fireEvent.input(screen.getByLabelText(/^password/i), {
            target: { value: mockSignupData.password }
        });
        fireEvent.input(screen.getByLabelText(/confirm password/i), {
            target: { value: mockSignupData.confirmPassword }
        });

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        await waitFor(() => {
            expect(mockSignup).toHaveBeenCalledWith(mockSignupData);
        });
    });

    it('displays error message when signup fails', async () => {
        const errorMessage = 'Email already exists';
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            signup: mockSignup,
            error: errorMessage,
            clearError: vi.fn(),
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
            login: vi.fn(),
            logout: vi.fn()
        }));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <SignupForm />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('disables submit button while loading', () => {
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            signup: mockSignup,
            error: null,
            clearError: vi.fn(),
            isLoading: true,
            user: null,
            token: null,
            isAuthenticated: false,
            login: vi.fn(),
            logout: vi.fn()
        }));

        render(
            <BrowserRouter>
                <AuthProvider>
                    <SignupForm />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByRole('button', { name: /signing up/i })).toBeDisabled();
    });
});
