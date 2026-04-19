import {
	createContext,
	useContext,
	useReducer,
	useEffect,
	useCallback,
} from "react";

const CartContext = createContext();

const initialState = {
	items: [],
	total: 0,
};

const cartReducer = (state, action) => {
	switch (action.type) {
		case "ADD_ITEM": {
			const { payload } = action;
			const existingItem = state.items.find((item) => item.id === payload.id);

			if (existingItem) {
				return {
					...state,
					items: state.items.map((item) =>
						item.id === payload.id ?
							{ ...item, quantity: item.quantity + payload.quantity }
						:	item,
					),
				};
			}

			return {
				...state,
				items: [
					...state.items,
					{ ...payload, quantity: payload.quantity || 1 },
				],
			};
		}

		case "UPDATE_QUANTITY": {
			const { id, quantity } = action.payload;
			if (quantity < 1) {
				return {
					...state,
					items: state.items.filter((item) => item.id !== id),
				};
			}
			return {
				...state,
				items: state.items.map((item) =>
					item.id === id ? { ...item, quantity } : item,
				),
			};
		}

		case "REMOVE_ITEM":
			return {
				...state,
				items: state.items.filter((item) => item.id !== action.payload.id),
			};

		case "CLEAR_CART":
			return initialState;

		case "SET_CART":
			return action.payload;

		default:
			return state;
	}
};

export const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	// Load cart from localStorage on mount
	useEffect(() => {
		try {
			const savedCart = localStorage.getItem("ubrestaurant-cart");
			if (savedCart) {
				const parsedCart = JSON.parse(savedCart);
				dispatch({ type: "SET_CART", payload: parsedCart });
			}
		} catch (error) {
			console.error("Failed to load cart from localStorage:", error);
			localStorage.removeItem("ubrestaurant-cart");
		}
	}, []);

	// Calculate total and save to localStorage whenever items change
	useEffect(() => {
		const calculatedTotal = state.items.reduce((sum, item) => {
			return sum + (Number(item.price) || 0) * (Number(item.quantity) || 1);
		}, 0);

		const updatedState = { ...state, total: calculatedTotal };

		// Save to localStorage
		try {
			localStorage.setItem("ubrestaurant-cart", JSON.stringify(updatedState));
		} catch (error) {
			console.error("Failed to save cart to localStorage:", error);
		}

		// Update state with new total (prevents infinite loop)
		if (calculatedTotal !== state.total) {
			dispatch({ type: "SET_CART", payload: updatedState });
		}
	}, [state.items]);

	// Memoized actions
	const addItem = useCallback((product, quantity = 1) => {
		if (!product?.id) {
			console.error("Product must have an id");
			return;
		}
		dispatch({
			type: "ADD_ITEM",
			payload: { ...product, quantity: Number(quantity) || 1 },
		});
	}, []);

	const updateQuantity = useCallback((id, quantity) => {
		dispatch({
			type: "UPDATE_QUANTITY",
			payload: { id, quantity: Number(quantity) || 1 },
		});
	}, []);

	const removeItem = useCallback((id) => {
		dispatch({ type: "REMOVE_ITEM", payload: { id } });
	}, []);

	const clearCart = useCallback(() => {
		dispatch({ type: "CLEAR_CART" });
		localStorage.removeItem("ubrestaurant-cart");
	}, []);

	const value = {
		items: state.items,
		total: state.total,
		addItem,
		updateQuantity,
		removeItem,
		clearCart,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};
