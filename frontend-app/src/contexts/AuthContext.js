'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        setIsLoggedIn(!!userId);
    }, []);

    const openAuthModal = () => {
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
        closeAuthModal();
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        setIsLoggedIn(false);
        window.location.href = '/';
    };

    const value = {
        isLoggedIn,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        handleLoginSuccess,
        handleLogout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
