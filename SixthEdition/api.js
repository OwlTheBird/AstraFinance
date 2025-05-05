// API Integration Module for Astra Financial
const API_BASE_URL = 'http://localhost:5001/api';
let authToken = localStorage.getItem('authToken');

// Authentication API
const AuthAPI = {
    // Register a new user
    register: async (name, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }
            
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },
    
    // Login user
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Store token in localStorage
            localStorage.setItem('authToken', data.access_token);
            authToken = data.access_token;
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    // Get user profile
    getProfile: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get profile');
            }
            
            return data.user;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },
    
    // Update user profile
    updateProfile: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }
            
            return data.user;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },
    
    // Logout user
    logout: () => {
        localStorage.removeItem('authToken');
        authToken = null;
    }
};

// Tax Calculation API
const TaxAPI = {
    // Calculate taxes
    calculateTaxes: async (taxData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tax/calculate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(taxData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Tax calculation failed');
            }
            
            return data;
        } catch (error) {
            console.error('Tax calculation error:', error);
            throw error;
        }
    },
    
    // Get tax history
    getTaxHistory: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tax/history`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get tax history');
            }
            
            return data.history;
        } catch (error) {
            console.error('Get tax history error:', error);
            throw error;
        }
    },
    
    // Optimize taxes
    optimizeTaxes: async (taxData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/tax/optimize`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ tax_data: taxData })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Tax optimization failed');
            }
            
            return data;
        } catch (error) {
            console.error('Tax optimization error:', error);
            throw error;
        }
    }
};

// Expense Tracker API
const ExpenseAPI = {
    // Add transaction
    addTransaction: async (transactionData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/transactions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(transactionData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add transaction');
            }
            
            return data.transaction;
        } catch (error) {
            console.error('Add transaction error:', error);
            throw error;
        }
    },
    
    // Get transactions
    getTransactions: async (filters = {}) => {
        try {
            let url = `${API_BASE_URL}/expenses/transactions`;
            
            // Add query parameters for filters
            const params = new URLSearchParams();
            if (filters.startDate) params.append('start_date', filters.startDate);
            if (filters.endDate) params.append('end_date', filters.endDate);
            if (filters.category) params.append('category', filters.category);
            if (filters.type) params.append('type', filters.type);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get transactions');
            }
            
            return data.transactions;
        } catch (error) {
            console.error('Get transactions error:', error);
            throw error;
        }
    },
    
    // Update transaction
    updateTransaction: async (transactionId, transactionData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/transactions/${transactionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(transactionData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update transaction');
            }
            
            return data.transaction;
        } catch (error) {
            console.error('Update transaction error:', error);
            throw error;
        }
    },
    
    // Delete transaction
    deleteTransaction: async (transactionId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/transactions/${transactionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete transaction');
            }
            
            return true;
        } catch (error) {
            console.error('Delete transaction error:', error);
            throw error;
        }
    },
    
    // Get categories
    getCategories: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/expenses/categories`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get categories');
            }
            
            return data.categories;
        } catch (error) {
            console.error('Get categories error:', error);
            throw error;
        }
    }
};

// CV Platform API
const CVAPI = {
    // Submit CV
    submitCV: async (cvData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/cv/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(cvData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit CV');
            }
            
            return data;
        } catch (error) {
            console.error('Submit CV error:', error);
            throw error;
        }
    },
    
    // Get CVs
    getCVs: async (filters = {}) => {
        try {
            let url = `${API_BASE_URL}/cv/browse`;
            
            // Add query parameters for filters
            const params = new URLSearchParams();
            if (filters.skills) params.append('skills', filters.skills);
            if (filters.experience) params.append('experience', filters.experience);
            if (filters.education) params.append('education', filters.education);
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get CVs');
            }
            
            return data.cvs;
        } catch (error) {
            console.error('Get CVs error:', error);
            throw error;
        }
    }
};

// Notifications API
const NotificationAPI = {
    // Get notifications
    getNotifications: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to get notifications');
            }
            
            return data.notifications;
        } catch (error) {
            console.error('Get notifications error:', error);
            throw error;
        }
    },
    
    // Mark notification as read
    markAsRead: async (notificationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to mark notification as read');
            }
            
            return true;
        } catch (error) {
            console.error('Mark notification as read error:', error);
            throw error;
        }
    }
};

// Export all APIs
const API = {
    Auth: AuthAPI,
    Tax: TaxAPI,
    Expense: ExpenseAPI,
    CV: CVAPI,
    Notification: NotificationAPI
};

// Make API available globally
window.API = API;
