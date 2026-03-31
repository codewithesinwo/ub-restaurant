import { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";
import { api } from "../api";

const AdminContext = createContext();

const adminReducer = (state, action) => {
	switch (action.type) {
		case "UPDATE_ORDER_STATUS":
			return {
				...state,
				orders: state.orders.map((o) =>
					o.id === action.payload.id ?
						{ ...o, status: action.payload.status }
					:	o,
				),
			};
		case "ADD_ORDER":
			return {
				...state,
				orders: [action.payload, ...state.orders],
				customers: state.customers.map((c) =>
					c.email === action.payload.customerEmail ?
						{ ...c, ordersCount: (c.ordersCount || 0) + 1 }
					:	c,
				),
			};
		case "SET_ADMIN_DATA":
			return action.payload;
		case "SET_ORDERS":
			return { ...state, orders: action.payload };
		case "SET_CUSTOMERS":
			return { ...state, customers: action.payload };
		default:
			return state;
	}
};

export const AdminProvider = ({ children }) => {
	const [state, dispatch] = useReducer(adminReducer, {
		orders: [],
		customers: [],
	});

	useEffect(() => {
		const loadData = async () => {
			try {
				const [ordersRes, customersRes] = await Promise.all([
					api.getOrders(),
					api.getCustomers(),
				]);
				dispatch({ type: "SET_ORDERS", payload: ordersRes });
				dispatch({ type: "SET_CUSTOMERS", payload: customersRes });
			} catch (error) {
				toast.error("Failed to load admin data");
				console.error("Admin data load failed:", error);
			}
		};
		loadData();
	}, []);

	const updateOrderStatus = async (id, status) => {
		try {
			const updatedOrder = await api.updateOrderStatus(id, status);
			dispatch({ type: "UPDATE_ORDER_STATUS", payload: { id, status } });
			toast.success(`Order ${id} status updated to ${status}`);
		} catch (error) {
			toast.error("Failed to update order status");
		}
	};

	const addOrder = async (order) => {
		try {
			const newOrder = await api.createOrder(order);
			dispatch({ type: "ADD_ORDER", payload: newOrder });
			toast.success("Order created successfully");
		} catch (error) {
			toast.error("Failed to create order");
		}
	};

	const isAdmin = localStorage.getItem("ubkitchen-admin") === "true";

	return (
		<AdminContext.Provider
			value={{ ...state, updateOrderStatus, addOrder, isAdmin }}>
			{children}
		</AdminContext.Provider>
	);
};

export const useAdmin = () => {
	const context = useContext(AdminContext);
	if (!context) throw new Error("useAdmin must be within AdminProvider");
	return context;
};
