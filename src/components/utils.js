import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(amount, options = {}) {
	const value = Number(amount) || 0;

	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency: "NGN",
		maximumFractionDigits: options.maximumFractionDigits ?? 0,
	}).format(value);
}
