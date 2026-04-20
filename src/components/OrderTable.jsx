import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Filter, Package, Search } from "lucide-react";
import { useAdmin } from "../contexts/AdminContext";
import { formatCurrency } from "./utils";

const getOrderDisplayId = (order, index) => {
	const rawId = order.id ?? order._id ?? index + 1;
	const idAsString = String(rawId);

	return /^\d+$/.test(idAsString) ?
			`#${idAsString.padStart(4, "0")}`
		:	`#${idAsString.slice(-8).toUpperCase()}`;
};

const OrderTable = ({ orders: sourceOrders }) => {
	const { orders: adminOrders, updateOrderStatus } = useAdmin();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const orders = sourceOrders ?? adminOrders;

	const filteredOrders = orders.filter((order) => {
		const customerName = order.customerName?.toLowerCase() || "";
		const customerEmail = order.customerEmail?.toLowerCase() || "";
		const query = search.toLowerCase();
		const matchesSearch =
			customerName.includes(query) || customerEmail.includes(query);
		const matchesStatus =
			statusFilter === "all" || order.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const statusOptions = ["all", "pending", "processing", "completed"];

	const handleStatusChange = (id, newStatus) => {
		updateOrderStatus(id, newStatus);
	};

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div className="flex flex-col lg:flex-row gap-4 mb-8">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search orders..."
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 transition-all"
					/>
				</div>
				<div className="relative">
					<select
						value={statusFilter}
						onChange={(event) => setStatusFilter(event.target.value)}
						className="appearance-none bg-white border border-gray-200 rounded-2xl pl-12 pr-10 py-4 focus:ring-4 focus:ring-amber-200 focus:border-amber-500 cursor-pointer">
						{statusOptions.map((option) => (
							<option key={option} value={option}>
								{option.charAt(0).toUpperCase() + option.slice(1)}
							</option>
						))}
					</select>
					<Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
					<ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
				</div>
			</div>

			<div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="bg-gray-50/50">
								<th className="px-8 py-6 text-left text-lg font-bold text-gray-900">
									Order
								</th>
								<th className="px-6 py-6 text-left text-lg font-semibold text-gray-900">
									Customer
								</th>
								<th className="px-6 py-6 text-left text-lg font-semibold text-gray-900">
									Items
								</th>
								<th className="px-6 py-6 text-right text-lg font-semibold text-gray-900">
									Total
								</th>
								<th className="px-6 py-6 text-left text-lg font-semibold text-gray-900">
									Status
								</th>
								<th className="px-6 py-6 text-left text-lg font-semibold text-gray-900">
									Date
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{filteredOrders.map((order, index) => (
								<motion.tr
									key={order.id || order._id || `${order.customerEmail}-${order.date}-${index}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="hover:bg-gray-50 transition-colors">
									<td className="px-8 py-8 font-bold text-amber-600">
										{getOrderDisplayId(order, index)}
									</td>
									<td className="px-6 py-8">
										<div>
											<div className="font-semibold text-gray-900">
												{order.customerName || "Walk-in Customer"}
											</div>
											<div className="text-sm text-gray-500">
												{order.customerEmail || "No email"}
											</div>
										</div>
									</td>
									<td className="px-6 py-8">
										<div className="flex flex-col">
											{(order.items || []).map((item, itemIndex) => (
												<div key={`${item.name}-${itemIndex}`} className="text-sm">
													{item.qty || 1}x {item.name}
												</div>
											))}
										</div>
									</td>
									<td className="px-6 py-8 text-right">
										<div className="text-2xl font-bold text-gray-900">
											{formatCurrency(order.total)}
										</div>
									</td>
									<td className="px-6 py-8">
										<select
											value={order.status || "pending"}
											onChange={(event) =>
												handleStatusChange(
													order.id ?? order._id,
													event.target.value,
												)
											}
											className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-200 focus:border-amber-500 cursor-pointer font-medium">
											<option value="pending">Pending</option>
											<option value="processing">Processing</option>
											<option value="completed">Completed</option>
										</select>
									</td>
									<td className="px-6 py-8 text-sm text-gray-500">
										{order.date ? new Date(order.date).toLocaleDateString() : "-"}
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredOrders.length === 0 && (
					<div className="text-center py-20">
						<Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
						<h3 className="text-xl font-bold text-gray-900 mb-2">
							No orders found
						</h3>
						<p className="text-gray-500">Try adjusting your search or filter</p>
					</div>
				)}
			</div>

			<p className="mt-4 text-sm text-gray-500">
				Showing {filteredOrders.length} of {orders.length} orders
			</p>
		</motion.div>
	);
};

export default OrderTable;
