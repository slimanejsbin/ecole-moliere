import { AuthState, User } from '../../types/auth.types';

export const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    roles: ['ROLE_USER'],
    permissions: ['STUDENT_READ', 'TEACHER_READ']
};

export const mockAuthState: AuthState = {
    user: mockUser,
    token: 'mock-token',
    isAuthenticated: true,
    isLoading: false,
    error: null
};

export const mockUnauthenticatedState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
};

export const mockAuthResponse = {
    token: 'mock-token',
    user: mockUser
};

export const mockLoginCredentials = {
    email: 'test@example.com',
    password: 'password123'
};

export const mockSignupData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    password: 'password123',
    confirmPassword: 'password123'
};
