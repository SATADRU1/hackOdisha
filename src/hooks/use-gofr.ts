import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface User {
    id: string;
    email: string;
    name: string;
}

interface MiningData {
    userId: string;
    status: 'active' | 'inactive' | 'stopped';
    hashrate: string;
    powerConsumption: string;
    temperature: string;
    uptime: string;
    earnings: {
        daily: string;
        weekly: string;
        monthly: string;
        currency: string;
    };
    pool: {
        name: string;
        url: string;
        workers: number;
    };
}

interface MiningConfig {
    pool: string;
    algorithm: string;
    intensity: number;
    autoStart: boolean;
    temperatureLimit: number;
    powerLimit: number;
}

export function useGofr() {
    const [user, setUser] = useState<User | null>(null);
    const [miningData, setMiningData] = useState<MiningData | null>(null);
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

    // Mining functions
    const fetchMiningData = async (userId: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/gofr/mining?userId=${userId}`);
            const data = await response.json();
            setMiningData(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch mining data:', error);
            toast({
                title: "Error",
                description: "Failed to fetch mining data",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const startMining = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/gofr/mining', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'start' })
            });
            const data = await response.json();
            
            if (response.ok) {
                toast({
                    title: "Mining Started",
                    description: data.message,
                });
                // Refresh mining data
                if (user) {
                    await fetchMiningData(user.id);
                }
                return data;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Failed to start mining:', error);
            toast({
                title: "Error",
                description: "Failed to start mining",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const stopMining = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/gofr/mining', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'stop' })
            });
            const data = await response.json();
            
            if (response.ok) {
                toast({
                    title: "Mining Stopped",
                    description: data.message,
                });
                // Refresh mining data
                if (user) {
                    await fetchMiningData(user.id);
                }
                return data;
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error('Failed to stop mining:', error);
            toast({
                title: "Error",
                description: "Failed to stop mining",
                variant: "destructive",
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const configureMining = async (config: MiningConfig) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/gofr/mining', {
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
            console.error('Failed to configure mining:', error);
            toast({
                title: "Error",
                description: "Failed to update mining configuration",
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
        miningData,
        isLoading,
        isAuthenticated,
        
        // Authentication functions
        login,
        register,
        logout,
        verifyToken,
        
        // Mining functions
        fetchMiningData,
        startMining,
        stopMining,
        configureMining,
    };
}
