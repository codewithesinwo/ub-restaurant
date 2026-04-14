import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { useAdmin } from "../contexts/AdminContext";
import UbLogo from "/ubrestaurantlogo.png";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const location = useLocation();
	const { items } = useCart();
	const { isAdmin } = useAdmin();

	const navLinks = [
		{ name: "Home", path: "/" },
		{ name: "Menu", path: "/services" },
		{ name: "About", path: "/about" },
		{ name: "Gallery", path: "/gallery" },
		{ name: "Contact", path: "/contact" },
		...(isAdmin ? [{ name: "Admin", path: "/admin/dashboard" }] : []),
	];

	const authLinks = [
		{ name: "Login", path: "/login" },
		{ name: "Sign Up", path: "/signup" },
	];

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link
							to="/"
							className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
							<img src={UbLogo} alt="UB Kitchen Logo" className="h-10 w-auto" />
						</Link>
					</div>

					<div className="hidden md:flex items-center space-x-6 lg:space-x-8">
						{navLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={`py-2 px-3 text-base lg:text-lg font-medium rounded-lg transition-colors ${
									location.pathname === link.path ?
										"text-amber-600 font-semibold"
									:	"text-gray-700 hover:text-amber-600 hover:bg-amber-50"
								}`}>
								{link.name}
							</Link>
						))}
					</div>

					<div className="flex items-center gap-2 md:gap-4">
						<Link
							to="/cart"
							className="relative p-2 rounded-xl hover:bg-amber-50 transition-all">
							<ShoppingCart className="w-6 h-6 text-gray-700" />
							{items.length > 0 && (
								<span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
									{items.length > 99 ? "99+" : items.length}
								</span>
							)}
						</Link>

						<div className="hidden md:flex items-center gap-2">
							{authLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={`px-5 py-2 text-sm font-medium rounded-xl transition-all ${
										location.pathname === link.path ?
											"bg-amber-600 text-white"
										:	"text-gray-700 hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
									}`}>
									{link.name}
								</Link>
							))}
						</div>

						<div className="md:hidden">
							<button
								onClick={() => setIsOpen(!isOpen)}
								className="p-2 rounded-xl text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-all">
								{isOpen ?
									<X size={26} />
								:	<Menu size={26} />}
							</button>
						</div>
					</div>
				</div>
			</div>

			{isOpen && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: "auto" }}
					className="md:hidden bg-white border-t shadow-lg">
					<div className="px-4 pt-4 pb-6 space-y-1">
						{navLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={`block py-3 px-4 rounded-xl text-base font-medium ${
									location.pathname === link.path ?
										"text-amber-600 bg-amber-50"
									:	"text-gray-700 hover:text-amber-600 hover:bg-amber-50"
								}`}
								onClick={() => setIsOpen(false)}>
								{link.name}
							</Link>
						))}

						<div className="border-t my-4" />

						<div className="space-y-2 pt-2">
							{authLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									className={`block py-3 px-4 rounded-xl text-base font-medium text-center ${
										location.pathname === link.path ?
											"bg-amber-600 text-white"
										:	"border border-gray-300 text-gray-700 hover:bg-gray-50"
									}`}
									onClick={() => setIsOpen(false)}>
									{link.name}
								</Link>
							))}
						</div>
					</div>
				</motion.div>
			)}
		</motion.nav>
	);
};

export default Navbar;
