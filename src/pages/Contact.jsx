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
else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
if (!formData.message.trim()) newErrors.message = "Please tell us what you want to order";

setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
e.preventDefault();

if (validateForm()) {
setIsSubmitting(true);

try {
await new Promise((resolve) => setTimeout(resolve, 1200));
setIsSubmitted(true);
setFormData({ name: "", email: "", phone: "", message: "" });
} catch (error) {
console.error("Submission error:", error);
} finally {
setIsSubmitting(false);
}
}
};

const handleChange = (e) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
};

const contactInfo = [
{ icon: Phone, title: "Call Us", value: "+234 803 123 4567", sub: "Mon - Sun, 8am - 11pm" },
{ icon: Mail, title: "Email Us", value: "hello@ubrestaurant.com", sub: "Fast replies within 60 min" },
{ icon: MapPin, title: "Visit Our Kitchen", value: "12 Adeola Odeku Street, Victoria Island, Lagos", sub: "Pick-up and dine-in available" },
];

return (
<div className="min-h-screen bg-gray-50">
<Section className="pt-32 pb-20">
<motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}>
<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-gray-900 to-amber-600 bg-clip-text text-transparent mb-6 tracking-tight">
Order or Send Us a Request
</h1>
<p className="text-xl text-gray-600 max-w-3xl mx-auto">
Need help with catering, delivery schedule, or custom meals? We are here to help.
</p>
</motion.div>

{isSubmitted ? (
<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
<Card className="text-center p-16 shadow-xl">
<div className="w-28 h-28 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
<Send className="w-14 h-14 text-emerald-600" />
</div>
<h2 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h2>
<p className="text-xl text-gray-600 mb-10">Your request has been received. We’ll contact you shortly about your order.</p>
<Button onClick={() => setIsSubmitted(false)} size="lg" className="px-12">Send Another Request</Button>
</Card>
</motion.div>
) : (
<div className="grid lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
<motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} className="lg:col-span-3">
<Card className="p-10 lg:p-14">
<h3 className="text-3xl font-bold text-gray-900 mb-2">Send us a message</h3>
<p className="text-gray-600 mb-10">Tell us your order or inquire about a custom package.</p>

<form onSubmit={handleSubmit} className="space-y-8">
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
<input type="text" name="name" value={formData.name} onChange={handleChange} className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-lg ${errors.name ? "border-red-400" : "border-gray-200 focus:border-amber-500"}`} placeholder="John Adebayo" />
{errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
</div>

<div className="grid md:grid-cols-2 gap-6">
<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
<input type="email" name="email" value={formData.email} onChange={handleChange} className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-lg ${errors.email ? "border-red-400" : "border-gray-200 focus:border-amber-500"}`} placeholder="john@example.com" />
{errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
<input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all text-lg ${errors.phone ? "border-red-400" : "border-gray-200 focus:border-amber-500"}`} placeholder="+234 803 123 4567" />
{errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
</div>
</div>

<div>
<label className="block text-sm font-semibold text-gray-700 mb-2">Tell us about your order *</label>
<textarea name="message" rows="6" value={formData.message} onChange={handleChange} className={`w-full px-5 py-4 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all resize-y text-lg ${errors.message ? "border-red-400" : "border-gray-200 focus:border-amber-500"}`} placeholder="I want 5 plates of jollof rice and chicken, for delivery at 7pm..." />
{errors.message && <p className="mt-2 text-sm text-red-600">{errors.message}</p>}
</div>

<Button type="submit" size="lg" className="w-full py-4 text-lg font-semibold" disabled={isSubmitting}>{isSubmitting ? "Sending Request..." : "Send Request"}</Button>
</form>
</Card>
</motion.div>

<motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
{contactInfo.map((info, index) => (
<motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
<div className="flex items-start gap-4">
<div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"> <info.icon className="w-5 h-5 text-amber-600" /> </div>
<div>
<p className="text-gray-900 font-semibold">{info.title}</p>
<p className="text-gray-500">{info.value}</p>
<p className="text-gray-400 text-sm">{info.sub}</p>
</div>
</div>
</motion.div>
))}
</motion.div>
</div>
)}
</Section>
</div>
);
};

export default Contact;
