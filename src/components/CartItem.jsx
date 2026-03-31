import Button from "./Button";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";

const CartItem = ({ id, name, price, image, quantity }) => {
	const { updateQuantity, removeItem } = useCart();

	const total = price * quantity;

	return (
		<motion.div
			layout
			className="flex gap-4 p-6 border rounded-2xl bg-white shadow-sm hover:shadow-md transition-all">
			<img
				src={image}
				alt={name}
				className="w-24 h-24 object-cover rounded-xl flex-shrink-0"
			/>
			<div className="flex-1 min-w-0">
				<h3 className="font-bold text-lg text-gray-900 mb-2 truncate">
					{name}
				</h3>
				<p className="text-2xl font-bold text-amber-600">${total.toFixed(2)}</p>
				<p className="text-sm text-gray-500">
					Price: ${price.toFixed(2)} x {quantity}
				</p>
			</div>
			<div className="flex items-center gap-2 self-start">
				<div className="flex items-center bg-gray-100 rounded-lg p-1">
					<Button
						variant="outline"
						size="sm"
						className="h-9 w-10 p-0"
						onClick={() => updateQuantity(id, Math.max(1, quantity - 1))}>
						<Minus className="h-4 w-4" />
					</Button>
					<span className="px-4 py-2 font-mono font-bold text-lg min-w-[3rem] text-center">
						{quantity}
					</span>
					<Button
						variant="outline"
						size="sm"
						className="h-9 w-10 p-0"
						onClick={() => updateQuantity(id, quantity + 1)}>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={() => removeItem(id)}
					className="h-10 flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50">
					<Trash2 className="h-4 w-4" />
				</Button>
			</div>
		</motion.div>
	);
};

export default CartItem;
