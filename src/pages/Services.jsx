import Section from "../components/Section";
import Card from "../components/Card";
import Button from "../components/Button";
import {
	LayoutDashboard,
	Hammer,
	Lightbulb,
	PaintBucket,
	ShoppingCart,
	Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";
import { useEffect, useState } from "react";
// import api from "../lib/api";

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
				// Filter only services
				const serviceProducts = data.filter((p) => p.category === "service");
				setProducts(serviceProducts);
			} catch (err) {
				console.error(err);
				setError("Failed to load services. Please try again later.");
				toast.error("Failed to load services");
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	const handleAddToCart = (service) => {
		addItem(service);
		toast.success(`${service.title} added to cart!`, {
			description: "You can view your cart anytime",
		});
	};

	// Icon mapping based on service title (you can expand this)
	const getServiceIcon = (title) => {
		const titleLower = title.toLowerCase();
		if (titleLower.includes("design")) return LayoutDashboard;
		if (titleLower.includes("installation")) return Hammer;
		if (titleLower.includes("lighting")) return Lightbulb;
		if (titleLower.includes("cabinet")) return PaintBucket;
		return Clock; // default
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="flex flex-col items-center">
					<div className="animate-spin rounded-full h-14 w-14 border-4 border-amber-200 border-t-amber-600"></div>
					<p className="mt-4 text-gray-500">Loading our services...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Hero Header */}
			<Section className="pt-32 pb-20 bg-gradient-to-br from-gray-900 to-amber-950 text-white">
				<motion.div
					className="text-center max-w-4xl mx-auto"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}>
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
						Our Kitchen Services
					</h1>
					<p className="text-xl text-gray-300 max-w-2xl mx-auto">
						From concept to completion — expert kitchen design, fabrication, and
						installation
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
						<div className="text-center mb-16">
							<p className="text-amber-600 font-semibold tracking-widest uppercase text-sm mb-2">
								WHAT WE OFFER
							</p>
							<h2 className="text-4xl md:text-5xl font-bold text-gray-900">
								Complete Kitchen Solutions
							</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{products.map((service, index) => {
								const Icon = getServiceIcon(service.title);

								return (
									<motion.div
										key={service.id || index}
										initial={{ opacity: 0, y: 40 }}
										whileInView={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.08 }}>
										<Card className="group h-full overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
											{/* Image */}
											<div className="relative h-64 overflow-hidden">
												<img
													src={service.image || "/placeholder-kitchen.jpg"}
													alt={service.title}
													className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
												/>
												<div className="absolute top-5 right-5 bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
													₦{service.price?.toLocaleString() || service.price}
												</div>
											</div>

											{/* Content */}
											<div className="p-8">
												<div className="flex justify-center -mt-10 mb-6">
													<div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
														<Icon className="w-10 h-10 text-white" />
													</div>
												</div>

												<h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-amber-600 transition-colors">
													{service.title}
												</h3>

												<p className="text-gray-600 text-center leading-relaxed mb-8 min-h-[80px]">
													{service.description}
												</p>

												{/* Features */}
												{service.features && service.features.length > 0 && (
													<div className="space-y-2 mb-10">
														{service.features.slice(0, 4).map((feature, i) => (
															<div
																key={i}
																className="flex items-start text-sm text-gray-600">
																<div className="w-2 h-2 mt-2 bg-amber-500 rounded-full mr-3 flex-shrink-0" />
																<span>{feature}</span>
															</div>
														))}
													</div>
												)}

												{/* Action Buttons */}
												<div className="flex gap-3">
													<Button
														variant="outline"
														className="flex-1"
														onClick={() => {
															// You can later add a modal for "Learn More"
															toast.info(
																"Feature coming soon: Detailed service view",
															);
														}}>
														Learn More
													</Button>

													<Button
														variant="primary"
														className="flex-1 flex items-center justify-center gap-2"
														onClick={() => handleAddToCart(service)}>
														<ShoppingCart className="w-4 h-4" />
														Add to Cart
													</Button>
												</div>
											</div>
										</Card>
									</motion.div>
								);
							})}
						</div>

						{/* Call to Action */}
						<div className="mt-20 text-center">
							<p className="text-gray-600 mb-6">
								Not sure which service is right for you?
							</p>
							<Button size="lg" className="px-10">
								Get a Free Consultation
							</Button>
						</div>
					</>
				}
			</Section>
		</div>
	);
};

export default Services;
