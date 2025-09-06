'use client';

import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface User {
    id: string;
    email: string;
    name: string;
}

interface FocusData {
    userId: string;
    status: 'active' | 'idle' | 'completed';
    currentSession?: {
        id: number;
        duration: number;
        stakeAmount: number;
        reward: number;
        status: string;
        startedAt: string;
        endedAt?: string;
        isSuccess?: boolean;
        txHash?: string;
    };
    streak: number;
    totalSessions: number;
    completedSessions: number;
    totalStaked: number;
    totalEarned: number;
    lastUpdated: string;
}

interface FocusConfig {
    defaultDuration: number;
    defaultStake: number;
    blockedWebsites: string[];
    notificationSound: boolean;
    autoStartBreak: boolean;
    breakDuration: number;
}

export function useGofr() {
    const [user, setUser] = useState<User | null>(null);
    const [focusData, setFocusData] = useState<FocusData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { toast } = useToast();

    // Authentication functions
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/gofr/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'login',
                    email,
                    password
                })
            });
            const data = await response.json();
            
            if (response.ok) {
                setUser(data.user);
                setIsAuthenticated(true);
                localStorage.setItem('gofr_token', data.token);
                toast({
                    title: "Login Successful",
                    description: data.message,
                });
                return data;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Login failed:', error);
            toast({
                title: "Login Failed",
                description: error instanceof Error ? error.message : "Invalid credentials",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/gofr/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'register',
                    email,
                    password,
                    name
                })
            });
            const data = await response.json();
            
            if (response.ok) {
                setUser(data.user);
                setIsAuthenticated(true);
                localStorage.setItem('gofr_token', data.token);
                toast({
                    title: "Registration Successful",
                    description: data.message,
                });
                return data;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            toast({
                title: "Registration Failed",
                description: error instanceof Error ? error.message : "Registration failed",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('gofr_token');
            if (token) {
                await fetch('/api/gofr/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'logout' })
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('gofr_token');
            setIsLoading(false);
        }
    };

    const verifyToken = async () => {
        const token = localStorage.getItem('gofr_token');
        if (!token) return false;

        try {
            const response = await fetch(`/api/gofr/auth?token=${token}`);
            const data = await response.json();
            
            if (response.ok && data.valid) {
                setUser(data.user);
                setIsAuthenticated(true);
                return true;
            } else {
                localStorage.removeItem('gofr_token');
                return false;
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            localStorage.removeItem('gofr_token');
            return false;
        }
    };

    // Focus functions
    const fetchFocusData = async (userId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/gofr/focus?userId=${userId}`);
            const data = await response.json();
            setFocusData(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch focus data:', error);
            toast({
                title: "Error",
                description: "Failed to fetch focus data",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const startFocusSession = async (duration: number, stakeAmount: number) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/gofr/focus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start',
                    duration,
                    stakeAmount
                })
            });
            const data = await response.json();
            
            if (response.ok) {
                toast({
                    title: "Focus Session Started",
                    description: data.message,
                });
                // Refresh focus data
                if (user) {
                    await fetchFocusData(user.id);
                }
                return data;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Failed to start focus session:', error);
            toast({
                title: "Error",
                description: "Failed to start focus session",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const completeFocusSession = async (sessionId: number, isSuccess: boolean) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/gofr/focus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'complete',
                    sessionId,
                    isSuccess
                })
            });
            const data = await response.json();
            
            if (response.ok) {
                toast({
                    title: "Focus Session Completed",
                    description: data.message,
                });
                // Refresh focus data
                if (user) {
                    await fetchFocusData(user.id);
                }
                return data;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Failed to complete focus session:', error);
            toast({
                title: "Error",
                description: "Failed to complete focus session",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const configureFocus = async (config: FocusConfig) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/gofr/focus', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'configure',
                    ...config
                })
            });
            const data = await response.json();
            
            if (response.ok) {
                toast({
                    title: "Configuration Updated",
                    description: data.message,
                });
                return data;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Failed to configure focus:', error);
            toast({
                title: "Error",
                description: "Failed to update focus configuration",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-verify token on mount
    useEffect(() => {
        verifyToken();
    }, []);

    return {
        // State
        user,
        focusData,
        isLoading,
        isAuthenticated,
        
        // Authentication functions
        login,
        register,
        logout,
        verifyToken,
        
        // Focus functions
        fetchFocusData,
        startFocusSession,
        completeFocusSession,
        configureFocus,
    };
}
