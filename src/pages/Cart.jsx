import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAdmin } from "../contexts/AdminContext";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import Button from "../components/Button";
import {
	ArrowLeft,
	CreditCard,
	Truck,
	ShoppingCart,
	Trash2,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { api } from "../api";
// import PaystackPop fr om "paystack-js";

const Cart = () => {
	const { items, total, clearCart } = useCart();
	const { addOrder } = useAdmin();

	const [customerName, setCustomerName] = useState("");
	const [customerEmail, setCustomerEmail] = useState("");
	const [paymentMode, setPaymentMode] = useState("online");
	const [isProcessing, setIsProcessing] = useState(false);

	const handleCheckout = async () => {
		if (items.length === 0) return;

		if (!customerName.trim() || !customerEmail.trim()) {
			toast.error("Please enter your full name and email address");
			return;
		}

		if (!/\\S+@\\S+\\.\\S+/.test(customerEmail)) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsProcessing(true);

		try {
			if (paymentMode === "online") {
				// Initialize Paystack payment
				const timestamp = Date.now();
				const paymentData = {
					email: customerEmail,
					amount: total,
					orderId: `order-${Math.floor(timestamp / 1000)}`,
				};

				const response = await api.initializePayment(paymentData);

				if (response.success) {
					const paystack = new PaystackPop();
					paystack.newTransaction({
						key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
						email: customerEmail,
						amount: total * 100,
						ref: response.data.reference,
						onSuccess: async (transaction) => {
							// Verify payment
							try {
								const verifyResponse = await api.verifyPayment(
									transaction.reference,
								);
								if (verifyResponse.success) {
									// Place order after successful payment
									await placeOrder();
								} else {
									toast.error("Payment verification failed");
								}
							} catch (_) {
								toast.error("Payment verification failed");
							}
						},
						onCancel: () => {
							toast.error("Payment cancelled");
							setIsProcessing(false);
						},
					});
				} else {
					toast.error("Failed to initialize payment");
					setIsProcessing(false);
				}
			} else {
				// Cash on delivery
				await placeOrder();
			}
		} catch (_) {
			toast.error("Failed to process checkout. Please try again.");
			setIsProcessing(false);
		}
	};

	const placeOrder = async () => {
		const newOrderData = {
			customerName: customerName.trim(),
			customerEmail: customerEmail.trim(),
			items: items.map((item) => ({
				name: item.title || item.name,
				qty: item.quantity || 1,
				price: item.price,
			})),
			total,
			paymentMode,
			date: new Date().toISOString(),
			deliveryMode: "delivery",
		};

		await addOrder(newOrderData);

		toast.success("Order placed successfully!", {
			description: "We will contact you shortly to confirm details.",
		});

		clearCart();
		setCustomerName("");
		setCustomerEmail("");
		setPaymentMode("online");
		setIsProcessing(false);
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

					<Link to="/">
						<Button size="lg" className="px-12 py-4 text-lg">
							Browse Menu
						</Button>
					</Link>
				</div>
				<Toaster />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-20 px-4">
			{/* <Toaster position="top-center" richColors /> */}

			<div className="max-w-6xl mx-auto">
				<div className="flex items-center gap-4 mb-10">
					<Link
						to="/"
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
							<div key={item.id || index} className="">
								<CartItem {...item} />
							</div>
						))}
					</div>

					<div className="lg:col-span-5 bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:sticky lg:top-24">
						<h3 className="text-2xl font-bold text-gray-900 mb-8">
							Order Summary
						</h3>

						<div className="space-y-4 mb-10">
							<div className="flex justify-between text-lg">
								<span className="text-gray-600">Subtotal</span>
								<span className="font-semibold">₦{total.toLocaleString()}</span>
							</div>
							<div className="flex justify-between text-lg">
								<span className="text-gray-600">Delivery Fee</span>
								<span className="text-emerald-600 font-medium">Free</span>
							</div>
							<div className="border-t pt-4 flex justify-between text-2xl font-bold">
								<span>Total</span>
								<span className="text-amber-600">
									₦{total.toLocaleString()}
								</span>
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
									onChange={(e) => setCustomerName(e.target.value)}
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
									onChange={(e) => setCustomerEmail(e.target.value)}
									className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
								/>
							</div>

							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Payment method
								</label>
								<select
									value={paymentMode}
									onChange={(e) => setPaymentMode(e.target.value)}
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
							<span>Online + offline payment</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
