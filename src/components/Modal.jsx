import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
	useEffect(() => {
		const handleEsc = (e) => {
			if (e.key === "Escape") onClose();
		};
		if (isOpen) {
			document.body.style.overflow = "hidden";
			document.addEventListener("keydown", handleEsc);
		}
		return () => {
			document.body.style.overflow = "unset";
			document.removeEventListener("keydown", handleEsc);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const sizeClasses = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-2xl",
		xl: "max-w-4xl",
	};

	return createPortal(
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
				onClick={onClose}>
				<motion.div
					initial={{ scale: 0.95, opacity: 0, y: 20 }}
					animate={{ scale: 1, opacity: 1, y: 0 }}
					exit={{ scale: 0.95, opacity: 0, y: 20 }}
					className={`bg-white rounded-3xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto ${sizeClasses[size]} w-full max-w-4xl`}
					onClick={(e) => e.stopPropagation()}>
					<div className="sticky top-0 bg-white/80 backdrop-blur-sm rounded-t-3xl border-b border-gray-100 z-10 p-6 flex items-center justify-between">
						<h3 className="text-2xl font-bold text-gray-900">{title}</h3>
						<button
							onClick={onClose}
							className="p-2 rounded-2xl hover:bg-gray-100 transition-colors">
							<X className="w-6 h-6 text-gray-500" />
						</button>
					</div>
					<div className="p-6 pb-12">{children}</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>,
		document.body,
	);
};

export default Modal;
