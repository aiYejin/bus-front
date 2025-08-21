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
        const currentLat = localStorage.getItem('currentLat');
        const currentLng = localStorage.getItem('currentLng');
        const currentLocationName = localStorage.getItem('currentLocationName');
        const locationUpdatedAt = localStorage.getItem('locationUpdatedAt');
        
        if (userId) {
            setIsLoggedIn(true);
            setUser({
                id: userId,
                username: username,
                email: email,
                createdAt: createdAt,
                currentLat: currentLat ? parseFloat(currentLat) : null,
                currentLng: currentLng ? parseFloat(currentLng) : null,
                currentLocationName: currentLocationName,
                locationUpdatedAt: locationUpdatedAt
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
        localStorage.removeItem('currentLat');
        localStorage.removeItem('currentLng');
        localStorage.removeItem('currentLocationName');
        localStorage.removeItem('locationUpdatedAt');
        setIsLoggedIn(false);
        setUser(null);
    };

    const updateUserInfo = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('username', updatedUser.username);
        localStorage.setItem('email', updatedUser.email);
        if (updatedUser.currentLat) {
            localStorage.setItem('currentLat', updatedUser.currentLat.toString());
        }
        if (updatedUser.currentLng) {
            localStorage.setItem('currentLng', updatedUser.currentLng.toString());
        }
        if (updatedUser.currentLocationName) {
            localStorage.setItem('currentLocationName', updatedUser.currentLocationName);
        }
        if (updatedUser.locationUpdatedAt) {
            localStorage.setItem('locationUpdatedAt', updatedUser.locationUpdatedAt);
        }
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
