const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiCall = async (endpoint, options = {}) => {
	try {
		const token = localStorage.getItem("token");

		const config = {
			headers: {
				"Content-Type": "application/json",
				...(token && { Authorization: `Bearer ${token}` }), // Auto-attach JWT
				...options.headers,
			},
			...options,
		};

		const response = await fetch(`${API_BASE}/api${endpoint}`, config);

		if (!response.ok) {
			let errorMessage = `API Error: ${response.status}`;
			try {
				const errorData = await response.json();
				errorMessage = errorData.message || errorMessage;
			} catch {
				// Ignore if response body is not JSON
			}
			throw new Error(errorMessage);
		}

		// Handle 204 No Content responses
		if (response.status === 204) {
			return {};
		}

		return await response.json();
	} catch (error) {
		console.error(
			`API call failed [${options.method || "GET"} ${endpoint}]:`,
			error,
		);
		throw error;
	}
};

// Main API service
export const api = {
	// Products
	getProducts: async () => {
		const result = await apiCall("/products");
		return result.data || result;
	},

	// Orders
	getOrders: () => apiCall("/orders"), // Admin - all orders
	getMyOrders: () => apiCall("/orders/my"), // User - their own orders
	createOrder: (orderData) =>
		apiCall("/orders", {
			method: "POST",
			body: JSON.stringify(orderData),
		}),
	updateOrderStatus: (id, status) =>
		apiCall(`/orders/${id}`, {
			method: "PATCH",
			body: JSON.stringify({ status }),
		}),

	// Users / Customers
	getCustomers: () => apiCall("/users/customers"), // Admin only
	getMe: () => apiCall("/users/me"), // Current user profile

	// Auth
	login: (credentials) =>
		apiCall("/auth/login", {
			method: "POST",
			body: JSON.stringify(credentials),
		}),

	register: (userData) =>
		apiCall("/auth/signup", {
			method: "POST",
			body: JSON.stringify(userData),
		}),

	// Utility
	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
	},
};

export default api;
