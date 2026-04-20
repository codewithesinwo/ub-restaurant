import { useState } from "react";
import { Popup } from "paystack-js";
import { Link } from "react-router-dom";
import {
	ArrowLeft,
	CreditCard,
	ShoppingCart,
	Trash2,
	Truck,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "../api";
import Button from "../components/Button";
import CartItem from "../components/CartItem";
import { formatCurrency } from "../components/utils";
import { useAdmin } from "../contexts/AdminContext";
import { useCart } from "../contexts/CartContext";

const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const PAYSTACK_PLACEHOLDER_KEY = "pk_test_your_paystack_public_key_here";

const createOrderId = () => {
	const reference = globalThis.crypto?.randomUUID?.();
	return reference ? `order-${reference}` : "order-web-checkout";
};

const isPaymentVerified = (response) =>
	Boolean(
		response?.success ||
			response?.status === "success" ||
			response?.data?.status === "success" ||
			response?.data?.status === true,
	);

const Cart = () => {
	const { items, total, clearCart } = useCart();
	const { addOrder } = useAdmin();
	const [customerName, setCustomerName] = useState("");
	const [customerEmail, setCustomerEmail] = useState("");
	const [paymentMode, setPaymentMode] = useState("online");
	const [isProcessing, setIsProcessing] = useState(false);

	const resetCheckoutForm = () => {
		clearCart();
		setCustomerName("");
		setCustomerEmail("");
		setPaymentMode("online");
		setIsProcessing(false);
	};

	const placeOrder = async () => {
		const newOrderData = {
			customerName: customerName.trim(),
			customerEmail: customerEmail.trim(),
			items: items.map((item) => ({
				name: item.title || item.name,
				qty: item.quantity || 1,
				price: Number(item.price) || 0,
			})),
			total: Number(total) || 0,
			paymentMode,
			date: new Date().toISOString(),
			deliveryMode: "delivery",
		};

		await addOrder(newOrderData);

		toast.success("Order placed successfully!", {
			description: "We will contact you shortly to confirm details.",
		});

		resetCheckoutForm();
	};

	const handleOnlineCheckout = async () => {
		const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

		if (!paystackKey || paystackKey === PAYSTACK_PLACEHOLDER_KEY) {
			toast.error("Paystack public key is not configured yet.");
			setIsProcessing(false);
			return;
		}

		const response = await api.initializePayment({
			email: customerEmail.trim(),
			amount: Number(total) || 0,
			orderId: createOrderId(),
		});

		const reference =
			response?.data?.reference ??
			response?.reference ??
			response?.data?.access_code ??
			response?.access_code;

		if (!reference) {
			toast.error("Failed to initialize payment");
			setIsProcessing(false);
			return;
		}

		const popup = new Popup({
			key: paystackKey,
			email: customerEmail.trim(),
			amount: Math.round((Number(total) || 0) * 100),
			ref: reference,
			callback: async (transaction) => {
				try {
					const verifyResponse = await api.verifyPayment(transaction.reference);

					if (!isPaymentVerified(verifyResponse)) {
						toast.error("Payment verification failed");
						setIsProcessing(false);
						return;
					}

					await placeOrder();
				} catch (error) {
					console.error("Payment verification failed:", error);
					toast.error("Payment verification failed");
					setIsProcessing(false);
				}
			},
			onClose: () => {
				toast.error("Payment cancelled");
				setIsProcessing(false);
			},
		});

		popup.open();
	};

	const handleCheckout = async () => {
		if (items.length === 0) {
			return;
		}

		if (!customerName.trim() || !customerEmail.trim()) {
			toast.error("Please enter your full name and email address");
			return;
		}

		if (!EMAIL_PATTERN.test(customerEmail.trim())) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsProcessing(true);

		try {
			if (paymentMode === "online") {
				await handleOnlineCheckout();
				return;
			}

			await placeOrder();
		} catch (error) {
			console.error("Checkout failed:", error);
			toast.error("Failed to process checkout. Please try again.");
			setIsProcessing(false);
		}
	};

	if (items.length === 0) {
		return (
			<div className="min-h-[80vh] flex items-center justify-center px-4 py-20 bg-gray-50">
				<div className="text-center max-w-md">
					<div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
						<ShoppingCart className="w-16 h-16 text-gray-400" />
					</div>

					<h2 className="text-4xl font-bold text-gray-900 mb-4">
						Your cart is empty
					</h2>
					<p className="text-xl text-gray-600 mb-10">
						Add meals to your order and checkout quickly.
					</p>

					<Button asLink to="/services" size="lg" className="px-12 py-4 text-lg">
						Browse Menu
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-20 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="flex items-center gap-4 mb-10">
					<Link
						to="/services"
						className="p-3 hover:bg-white rounded-2xl transition-colors">
						<ArrowLeft className="w-6 h-6 text-gray-700" />
					</Link>
					<div>
						<h1 className="text-4xl font-bold text-gray-900">Your Order</h1>
						<p className="text-gray-600 mt-1">
							{items.length} item{items.length > 1 ? "s" : ""}
						</p>
					</div>
				</div>

				<div className="grid lg:grid-cols-12 gap-8">
					<div className="lg:col-span-7 space-y-6">
						{items.map((item, index) => (
							<CartItem
								key={item.id || item._id || item.title || index}
								{...item}
							/>
						))}
					</div>

					<div className="lg:col-span-5 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:sticky lg:top-24">
						<h3 className="text-2xl font-bold text-gray-900 mb-8">
							Order Summary
						</h3>

						<div className="space-y-4 mb-10">
							<div className="flex justify-between text-lg">
								<span className="text-gray-600">Subtotal</span>
								<span className="font-semibold">{formatCurrency(total)}</span>
							</div>
							<div className="flex justify-between text-lg">
								<span className="text-gray-600">Delivery Fee</span>
								<span className="text-emerald-600 font-medium">Free</span>
							</div>
							<div className="border-t pt-4 flex justify-between text-2xl font-bold">
								<span>Total</span>
								<span className="text-amber-600">{formatCurrency(total)}</span>
							</div>
						</div>

						<div className="space-y-6 mb-8">
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Full Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									value={customerName}
									onChange={(event) => setCustomerName(event.target.value)}
									className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Email Address <span className="text-red-500">*</span>
								</label>
								<input
									type="email"
									value={customerEmail}
									onChange={(event) => setCustomerEmail(event.target.value)}
									className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Payment method
								</label>
								<select
									value={paymentMode}
									onChange={(event) => setPaymentMode(event.target.value)}
									className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all">
									<option value="online">Pay Online</option>
									<option value="cod">Cash on Delivery</option>
								</select>
							</div>
						</div>

						<div className="space-y-4">
							<Button
								size="lg"
								className="w-full py-4 text-lg font-semibold flex items-center justify-center gap-3"
								onClick={handleCheckout}
								disabled={isProcessing}>
								{isProcessing ?
									"Placing Order..."
								:	<>
										<CreditCard className="w-5 h-5" />
										Place Order
									</>
								}
							</Button>

							<Button
								variant="outline"
								size="lg"
								className="w-full py-4 text-lg flex items-center justify-center gap-2 text-red-600 hover:bg-red-50"
								onClick={clearCart}>
								<Trash2 className="w-5 h-5" />
								Clear Entire Cart
							</Button>
						</div>

						<div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
							<div className="flex items-center gap-1.5">
								<Truck className="w-4 h-4" />
								<span>Free Delivery</span>
							</div>
							<div className="h-1 w-1 bg-gray-300 rounded-full" />
							<span>Online and offline payment</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
