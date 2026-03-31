const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const api = {
  getProducts: () => apiCall('/products'),
  getOrders: () => apiCall('/orders'),
  getCustomers: () => apiCall('/customers'),
  createOrder: (orderData) => apiCall('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
  updateOrderStatus: (id, status) => apiCall(`/orders/${id}`, { 
    method: 'PATCH', 
    body: JSON.stringify({ status }) 
  }),
};

