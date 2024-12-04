import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import * as authHook from '../../../contexts/AuthContext';
import { mockUser } from '../../mocks/auth.mock';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(() => ({ pathname: '/test' }))
    };
});

describe('ProtectedRoute', () => {
    const TestComponent = () => <div>Protected Content</div>;

    it('renders children when authenticated', () => {
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            isAuthenticated: true,
            user: mockUser,
            login: vi.fn(),
            signup: vi.fn(),
            logout: vi.fn(),
            clearError: vi.fn(),
            error: null,
            token: 'token',
            isLoading: false
        }));

        const { getByText } = render(
            <BrowserRouter>
                <ProtectedRoute>
                    <TestComponent />
                </ProtectedRoute>
            </BrowserRouter>
        );

        expect(getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to login when not authenticated', () => {
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            isAuthenticated: false,
            user: null,
            login: vi.fn(),
            signup: vi.fn(),
            logout: vi.fn(),
            clearError: vi.fn(),
            error: null,
            token: null,
            isLoading: false
        }));

        const { queryByText } = render(
            <BrowserRouter>
                <ProtectedRoute>
                    <TestComponent />
                </ProtectedRoute>
            </BrowserRouter>
        );

        expect(queryByText('Protected Content')).not.toBeInTheDocument();
        expect(window.location.pathname).toBe('/login');
    });

    it('allows access when user has required permissions', () => {
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            isAuthenticated: true,
            user: mockUser,
            login: vi.fn(),
            signup: vi.fn(),
            logout: vi.fn(),
            clearError: vi.fn(),
            error: null,
            token: 'token',
            isLoading: false
        }));

        const { getByText } = render(
            <BrowserRouter>
                <ProtectedRoute requiredPermissions={['STUDENT_READ']}>
                    <TestComponent />
                </ProtectedRoute>
            </BrowserRouter>
        );

        expect(getByText('Protected Content')).toBeInTheDocument();
    });

    it('redirects to unauthorized when user lacks required permissions', () => {
        vi.spyOn(authHook, 'useAuth').mockImplementation(() => ({
            isAuthenticated: true,
            user: { ...mockUser, permissions: [] },
            login: vi.fn(),
            signup: vi.fn(),
            logout: vi.fn(),
            clearError: vi.fn(),
            error: null,
            token: 'token',
            isLoading: false
        }));

        const { queryByText } = render(
            <BrowserRouter>
                <ProtectedRoute requiredPermissions={['ADMIN_ACCESS']}>
                    <TestComponent />
                </ProtectedRoute>
            </BrowserRouter>
        );

        expect(queryByText('Protected Content')).not.toBeInTheDocument();
        expect(window.location.pathname).toBe('/unauthorized');
    });
});
