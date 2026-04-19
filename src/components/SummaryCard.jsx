import { motion } from "framer-motion";
import { DollarSign, Package, Users, TrendingUp } from "lucide-react";

const SummaryCard = ({ title, value, change, icon: Icon, trend = "up" }) => {
	return (
		<motion.div
			whileHover={{ y: -4, scale: 1.02 }}
			className="group bg-white rounded-3xl p-8 border border-gray-100 shadow-xl hover:shadow-2xl hover:border-amber-200 transition-all duration-300 overflow-hidden">
			<div className="flex items-start justify-between">
				<div>
					<p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
						{title}
					</p>
					<p className="text-4xl font-bold text-gray-900 mb-1 group-hover:text-amber-600 transition-colors">
						{value}
					</p>
					<div className="flex items-center space-x-1">
						<span
							className={`text-sm font-semibold ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
							{trend === "up" ? "+" : "-"}
							{change}%
						</span>
						<span className="text-sm text-gray-500">vs last month</span>
					</div>
				</div>
				<div
					className={`p-4 rounded-2xl bg-gradient-to-br ${trend === "up" ? "from-emerald-500/10 to-emerald-600/10" : "from-red-500/10 to-red-600/10"} border border-white/50 group-hover:scale-110 transition-all`}>
					<Icon className="w-10 h-10 text-gray-500 group-hover:text-emerald-600 transition-colors" />
				</div>
			</div>
		</motion.div>
	);
};

export default SummaryCard;
