import Section from "../components/Section";
import Card from "../components/Card";
import Button from "../components/Button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { api } from "../api";

const Services = () => {
	const { addItem } = useCart();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				setLoading(true);
				const data = await api.getProducts();
				const menuItems = data.filter((p) => p.category === "product");
				setProducts(menuItems);
			} catch (err) {
				console.error(err);
				setError("Failed to load menu items. Please try again later.");
				toast.error("Failed to load menu items");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const handleAddToCart = (item) => {
		addItem(item);
		toast.success(`${item.title} added to your order!`, {
			description: "You can checkout online or pay cash on delivery.",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="animate-spin rounded-full h-14 w-14 border-4 border-amber-200 border-t-amber-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<Section className="pt-32 pb-16 bg-gradient-to-br from-gray-900 to-amber-950 text-white">
				<motion.div
					className="text-center max-w-4xl mx-auto"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}>
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
						Order Delicious Meals Online or Cash on Delivery
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						Browse our menu, place your order, and choose online payment or pay
						when your food arrives.
					</p>
				</motion.div>
			</Section>

			<Section className="py-20">
				{error ?
					<div className="text-center py-20">
						<p className="text-red-600 text-lg mb-4">{error}</p>
						<Button onClick={() => window.location.reload()}>Try Again</Button>
					</div>
				:	<>
						<div className="text-center mb-14">
							<p className="text-amber-600 font-semibold tracking-widest uppercase text-sm mb-2">
								MENU
							</p>
							<h2 className="text-4xl md:text-5xl font-bold text-gray-900">
								Chef’s Specials for Delivery and Pickup
							</h2>
							<p className="text-gray-600 mt-4 max-w-3xl mx-auto">
								Freshly cooked meals updated daily. Now offering both online
								payment and cash on delivery.
							</p>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{products.map((item, index) => (
								<motion.div
									key={item._id || index}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.07 }}>
									<Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
										<div className="relative h-64 overflow-hidden">
											<img
												src={item.image}
												alt={item.title}
												className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
											/>
											<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
												₦{Number(item.price).toLocaleString()}
											</div>
										</div>

										<div className="p-8">
											<h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">
												{item.title}
											</h3>
											<p className="text-gray-600 mb-6 min-h-[72px]">
												{item.description || "Delicious meal from our chef."}
											</p>
											<Button
												variant="primary"
												className="w-full flex items-center justify-center gap-2"
												onClick={() => handleAddToCart(item)}>
												<ShoppingCart className="w-4 h-4" />
												Add to Cart
											</Button>
										</div>
									</Card>
								</motion.div>
							))}
						</div>

						<div className="text-center mt-16">
							<p className="text-gray-600">
								Need help choosing? Contact us for custom meal packages.
							</p>
						</div>
					</>
				}
			</Section>
		</div>
	);
};

export default Services;
