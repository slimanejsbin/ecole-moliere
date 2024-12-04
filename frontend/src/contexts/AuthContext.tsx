import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { AuthState, AuthContextType, LoginRequest, SignupRequest, AuthResponse } from '../types/auth.types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: false,
    error: null
};

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: AuthResponse }
    | { type: 'AUTH_FAILURE'; payload: string }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true, error: null };
        case 'AUTH_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...initialState,
                token: null
            };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    const login = useCallback(async (credentials: LoginRequest) => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/signin`, credentials);
            dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({
                type: 'AUTH_FAILURE',
                payload: error instanceof Error ? error.message : 'An error occurred during login'
            });
            throw error;
        }
    }, []);

    const signup = useCallback(async (data: SignupRequest) => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/signup`, data);
            dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
        } catch (error) {
            dispatch({
                type: 'AUTH_FAILURE',
                payload: error instanceof Error ? error.message : 'An error occurred during signup'
            });
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        dispatch({ type: 'LOGOUT' });
    }, []);

    const clearError = useCallback(() => {
        dispatch({ type: 'CLEAR_ERROR' });
    }, []);

    const value = {
        ...state,
        login,
        signup,
        logout,
        clearError
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
