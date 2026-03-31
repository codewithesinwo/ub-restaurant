import { useState } from "react";
import Section from "../components/Section";
import Card from "../components/Card";
import Button from "../components/Button";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const validateForm = () => {
		const newErrors = {};

		if (!formData.name.trim()) newErrors.name = "Please enter your full name";
		if (!formData.email.trim()) newErrors.email = "Email is required";
		else if (!/\S+@\S+\.\S+/.test(formData.email))
			newErrors.email = "Please enter a valid email";
		if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
		if (!formData.message.trim())
			newErrors.message = "Please tell us about your project";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (validateForm()) {
			setIsSubmitting(true);

			// Simulate API call
			try {
				await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate network delay

				console.log("Contact form submitted:", formData);
				setIsSubmitted(true);

				// Reset form after successful submission
				setFormData({ name: "", email: "", phone: "", message: "" });
			} catch (error) {
				console.error("Submission error:", error);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});

		// Clear error when user starts typing
		if (errors[e.target.name]) {
			setErrors({
				...errors,
				[e.target.name]: "",
			});
		}
	};

	const contactInfo = [
		{
			icon: Phone,
			title: "Call Us",
			value: "+234 803 123 4567",
			sub: "Mon - Sat, 8am - 6pm",
		},
		{
			icon: Mail,
			title: "Email Us",
			value: "hello@ubkitchens.com",
			sub: "We reply within 24 hours",
		},
		{
			icon: MapPin,
			title: "Visit Our Showroom",
			value: "12 Adeola Odeku Street, Victoria Island, Lagos",
			sub: "By appointment only",
		},
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<Section className="pt-32 pb-20">
				{/* Header */}
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}>
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent mb-6 tracking-tight">
						Let's Build Your Dream Kitchen
					</h1>
					<p className="text-xl text-gray-600 max-w-3xl mx-auto">
						Tell us about your project. Our team will get back to you within 24
						hours.
					</p>
				</motion.div>

				{isSubmitted ?
					/* Success State */
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="max-w-lg mx-auto">
						<Card className="text-center p-16 shadow-xl">
							<div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
								<Send className="w-14 h-14 text-emerald-600" />
							</div>
							<h2 className="text-4xl font-bold text-gray-900 mb-4">
								Thank You!
							</h2>
							<p className="text-xl text-gray-600 mb-10">
								Your message has been received. We'll contact you very soon.
							</p>
							<Button
								onClick={() => {
									setIsSubmitted(false);
								}}
								size="lg"
								className="px-12">
								Send Another Message
							</Button>
						</Card>
					</motion.div>
				:	<div className="grid lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
						{/* Contact Form - Takes 3 columns */}
						<motion.div
							initial={{ opacity: 0, x: -40 }}
							whileInView={{ opacity: 1, x: 0 }}
							className="lg:col-span-3">
							<Card className="p-10 lg:p-14">
								<h3 className="text-3xl font-bold text-gray-900 mb-2">
									Send us a message
								</h3>
								<p className="text-gray-600 mb-10">
									We'll respond as quickly as possible.
								</p>

								<form onSubmit={handleSubmit} className="space-y-8">
									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Full Name *
										</label>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleChange}
											className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-lg ${
												errors.name ? "border-red-400" : (
													"border-gray-200 focus:border-amber-500"
												)
											}`}
											placeholder="John Adebayo"
										/>
										{errors.name && (
											<p className="mt-2 text-sm text-red-600">{errors.name}</p>
										)}
									</div>

									<div className="grid md:grid-cols-2 gap-6">
										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Email Address *
											</label>
											<input
												type="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-lg ${
													errors.email ? "border-red-400" : (
														"border-gray-200 focus:border-amber-500"
													)
												}`}
												placeholder="john@example.com"
											/>
											{errors.email && (
												<p className="mt-2 text-sm text-red-600">
													{errors.email}
												</p>
											)}
										</div>

										<div>
											<label className="block text-sm font-semibold text-gray-700 mb-2">
												Phone Number *
											</label>
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-lg ${
													errors.phone ? "border-red-400" : (
														"border-gray-200 focus:border-amber-500"
													)
												}`}
												placeholder="+234 803 123 4567"
											/>
											{errors.phone && (
												<p className="mt-2 text-sm text-red-600">
													{errors.phone}
												</p>
											)}
										</div>
									</div>

									<div>
										<label className="block text-sm font-semibold text-gray-700 mb-2">
											Tell us about your project *
										</label>
										<textarea
											name="message"
											rows="6"
											value={formData.message}
											onChange={handleChange}
											className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all resize-y text-lg ${
												errors.message ? "border-red-400" : (
													"border-gray-200 focus:border-amber-500"
												)
											}`}
											placeholder="I'm looking for a modern kitchen renovation for my 4-bedroom home in Lekki..."
										/>
										{errors.message && (
											<p className="mt-2 text-sm text-red-600">
												{errors.message}
											</p>
										)}
									</div>

									<Button
										type="submit"
										size="lg"
										className="w-full py-4 text-lg font-semibold"
										disabled={isSubmitting}>
										{isSubmitting ? "Sending Message..." : "Send Message"}
									</Button>
								</form>
							</Card>
						</motion.div>

						{/* Contact Information - Takes 2 columns */}
						<motion.div
							initial={{ opacity: 0, x: 40 }}
							whileInView={{ opacity: 1, x: 0 }}
							className="lg:col-span-2 space-y-6">
							{contactInfo.map((info, index) => (
								<motion.div
									key={info.title}
									initial={{ opacity: 0, y: 30 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}>
									<Card className="p-8 hover:shadow-xl transition-all group h-full">
										<div className="flex gap-6">
											<div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
												<info.icon className="w-8 h-8 text-white" />
											</div>
											<div className="flex-1">
												<h4 className="font-semibold text-xl text-gray-900 mb-1">
													{info.title}
												</h4>
												<p className="text-2xl font-bold text-gray-900 mb-3">
													{info.value}
												</p>
												{info.sub && (
													<p className="text-gray-600 flex items-center gap-2 text-sm">
														<Clock className="w-4 h-4" />
														{info.sub}
													</p>
												)}
											</div>
										</div>
									</Card>
								</motion.div>
							))}

							{/* Extra Info Card */}
							<Card className="p-8 bg-gradient-to-br from-amber-50 to-white border-amber-100">
								<p className="text-amber-700 font-medium">
									💡 Free consultation available for projects above ₦5,000,000
								</p>
							</Card>
						</motion.div>
					</div>
				}
			</Section>
		</div>
	);
};

export default Contact;
