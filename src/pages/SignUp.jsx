import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Card from "../components/Card";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

export default function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { register } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		setLoading(true);

		try {
			await register({ name, email, password, role: "customer" });
			toast.success("Account created successfully");
			navigate("/");
		} catch (error) {
			toast.error(error.message || "Unable to create account.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="min-h-[calc(100vh-220px)] flex items-center justify-center py-16 px-4">
			<Card className="w-full max-w-xl">
				<div className="mb-8 text-center">
					<h1 className="text-4xl font-bold text-gray-900 mb-3">
						Create an account
					</h1>
					<p className="text-gray-600">
						Register now to save your cart and place orders faster.
					</p>
				</div>

				<form className="space-y-6" onSubmit={handleSubmit}>
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 mb-2">
							Full name
						</label>
						<input
							id="name"
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Jane Doe"
							className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none"
						/>
					</div>

					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-2">
							Email address
						</label>
						<input
							id="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@example.com"
							className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-2">
							Password
						</label>
						<input
							id="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Create a password"
							className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none"
						/>
					</div>

					<div>
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700 mb-2">
							Confirm password
						</label>
						<input
							id="confirmPassword"
							type="password"
							required
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="Repeat your password"
							className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none"
						/>
					</div>

					<Button type="submit" className="w-full" disabled={loading}>
						{loading ? "Creating account..." : "Create account"}
					</Button>
				</form>

				<p className="mt-6 text-sm text-center text-gray-600">
					Already have an account?{" "}
					<Link
						to="/login"
						className="font-semibold text-amber-600 hover:text-amber-700">
						Sign in
					</Link>
				</p>
			</Card>
		</main>
	);
}
