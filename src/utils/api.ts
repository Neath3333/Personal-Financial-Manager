const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-domain.com/api'
  : 'http://localhost:3010/api';

class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP error! status: ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error('Network error occurred');
  }
};

export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials: { email: string; password: string }) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
};

export const transactionsAPI = {
  getTransactions: (params?: {
    filter?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/transactions${query}`);
  },

  addTransaction: (transactionData: {
    type: 'Income' | 'Expense';
    amount: number;
    categoryId: string;
    date?: string;
    notes?: string;
  }) =>
    apiRequest('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),

  updateTransaction: (id: string, transactionData: {
    type?: 'Income' | 'Expense';
    amount?: number;
    categoryId?: string;
    date?: string;
    notes?: string;
  }) =>
    apiRequest(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    }),

  deleteTransaction: (id: string) =>
    apiRequest(`/transactions/${id}`, {
      method: 'DELETE',
    }),
};

export const dashboardAPI = {
  getDashboardData: (params?: {
    filter?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiRequest(`/dashboard${query}`);
  },
};

export const exportAPI = {
  exportPDF: async (params?: {
    filter?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    const url = `${API_BASE_URL}/export/pdf${query}`;

    try {
      const response = await fetch(url, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export PDF');
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      throw new Error('Network error occurred while exporting PDF');
    }
  },
};

export default apiRequest;