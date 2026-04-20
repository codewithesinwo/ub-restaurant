import { createContext, useContext, useMemo, useState } from "react";
import api from "../api";

const TOKEN_STORAGE_KEY = "token";
const USER_STORAGE_KEY = "user";

const getStoredUser = () => {
	const token = localStorage.getItem(TOKEN_STORAGE_KEY);
	const savedUser = localStorage.getItem(USER_STORAGE_KEY);

	if (!token || !savedUser) {
		return null;
	}

	try {
		return JSON.parse(savedUser);
	} catch (error) {
		console.error("Failed to parse stored user:", error);
		localStorage.removeItem(TOKEN_STORAGE_KEY);
		localStorage.removeItem(USER_STORAGE_KEY);
		return null;
	}
};

const AuthContext = createContext(null);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(getStoredUser);
	const loading = false;

	const login = async (email, password) => {
		try {
			const data = await api.login({ email, password });

			localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
			setUser(data.user);

			return data.user;
		} catch (error) {
			console.error("Login error:", error);
			throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem(TOKEN_STORAGE_KEY);
		localStorage.removeItem(USER_STORAGE_KEY);
		setUser(null);
	};

	const register = async (userData) => {
		try {
			const data = await api.register(userData);

			localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
			localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
			setUser(data.user);

			return data.user;
		} catch (error) {
			console.error("Registration error:", error);
			throw error;
		}
	};

	const value = useMemo(
		() => ({
			user,
			loading,
			login,
			logout,
			register,
			isAuthenticated: !!user,
		}),
		[loading, user],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
