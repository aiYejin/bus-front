'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const createdAt = localStorage.getItem('createdAt');
        
        if (userId) {
            setIsLoggedIn(true);
            setUser({
                id: userId,
                username: username,
                email: email,
                createdAt: createdAt
            });
        }
        setIsLoading(false);
    }, []);

    const openAuthModal = () => {
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const handleLoginSuccess = (userData) => {
        setIsLoggedIn(true);
        setUser(userData);
        closeAuthModal();
    };

    const handleLogout = () => {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        localStorage.removeItem('createdAt');
        setIsLoggedIn(false);
        setUser(null);
    };

    const updateUserInfo = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('username', updatedUser.username);
        localStorage.setItem('email', updatedUser.email);
    };

    const value = {
        isLoggedIn,
        user,
        isLoading,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        handleLoginSuccess,
        handleLogout,
        updateUserInfo
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
