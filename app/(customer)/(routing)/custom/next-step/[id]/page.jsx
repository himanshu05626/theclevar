
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SIZES = ["S", "M", "L", "XL", "XXL"];
const FABRICS = ["Cotton", "Polyester", "Cotton Blend"];
const GSMS = [160, 180, 200];

export default function CustomTshirtNextStep() {
	const { id } = useParams();
	const router = useRouter();
	const [imageUrl, setImageUrl] = useState("");
	const [size, setSize] = useState("M");
	const [fabric, setFabric] = useState("Cotton");
	const [gsm, setGsm] = useState(180);
	const [price, setPrice] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [adding, setAdding] = useState(false);
	const [success, setSuccess] = useState(false);

	// Fetch imageUrl for this id
	useEffect(() => {
		async function fetchImage() {
			try {
				const res = await fetch(`/api/custom?id=${id}`);
				const data = await res.json();
				if (data.success && data.data && data.data.image_url) {
					setImageUrl(data.data.image_url);
				} else if (data.imageUrl) {
					setImageUrl(data.imageUrl);
				}
			} catch {}
		}
		if (id) fetchImage();
	}, [id]);

	// Fetch price when options change
	useEffect(() => {
		async function fetchPrice() {
			setLoading(true);
			setError("");
			try {
				const res = await fetch("/api/custom/price", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ size, fabric, gsm }),
				});
				const data = await res.json();
				if (data.success) setPrice(data.price);
				else setError("Failed to get price");
			} catch {
				setError("Failed to get price");
			} finally {
				setLoading(false);
			}
		}
		fetchPrice();
	}, [size, fabric, gsm]);

	async function handleAddToCart() {
		setAdding(true);
		setError("");
		setSuccess(false);
		try {
			// Example: call your cart API
			const res = await fetch("/api/cart", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					tshirtId: id,
					imageUrl,
					size,
					fabric,
					gsm,
					price,
				}),
			});
			const data = await res.json();
			if (data.success) {
				setSuccess(true);
				// Optionally redirect to cart
				// router.push("/cart");
			} else {
				setError(data.message || "Failed to add to cart");
			}
		} catch {
			setError("Failed to add to cart");
		} finally {
			setAdding(false);
		}
	}

	return (
		<div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-2 py-8">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7 }}
				className="w-full max-w-lg bg-[#0f0f0f]/80 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-6 shadow-cyan-400/20 shadow-xl mt-8"
			>
				<h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">Customize Your T-shirt</h2>
				{imageUrl && (
					<img
						src={imageUrl}
						alt="Generated T-shirt"
						className="w-full rounded-2xl border-2 border-cyan-400 shadow-cyan-400/20 shadow-lg object-cover max-h-80 mx-auto mb-6 bg-black"
						style={{ background: '#0f0f0f' }}
					/>
				)}
				<div className="flex flex-col gap-4">
					<div>
						<label className="block text-cyan-300 font-semibold mb-1">Size</label>
						<select
							value={size}
							onChange={e => setSize(e.target.value)}
							className="w-full bg-black border border-cyan-400/40 rounded-xl px-4 py-2 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
						>
							{SIZES.map(s => (
								<option key={s} value={s}>{s}</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-cyan-300 font-semibold mb-1">Fabric</label>
						<select
							value={fabric}
							onChange={e => setFabric(e.target.value)}
							className="w-full bg-black border border-cyan-400/40 rounded-xl px-4 py-2 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
						>
							{FABRICS.map(f => (
								<option key={f} value={f}>{f}</option>
							))}
						</select>
					</div>
					<div>
						<label className="block text-cyan-300 font-semibold mb-1">GSM</label>
						<select
							value={gsm}
							onChange={e => setGsm(Number(e.target.value))}
							className="w-full bg-black border border-cyan-400/40 rounded-xl px-4 py-2 text-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
						>
							{GSMS.map(g => (
								<option key={g} value={g}>{g}</option>
							))}
						</select>
					</div>
					<div className="flex items-center justify-between mt-4">
						<span className="text-lg font-bold text-cyan-400">Price:</span>
						<span className="text-2xl font-extrabold text-white">{loading ? '...' : `₹${price}`}</span>
					</div>
					{error && <p className="text-pink-400 text-center font-semibold mt-2">{error}</p>}
					{success && <p className="text-green-400 text-center font-semibold mt-2">Added to cart!</p>}
					<motion.button
						whileHover={{ scale: !adding ? 1.05 : 1 }}
						whileTap={{ scale: 0.97 }}
						onClick={handleAddToCart}
						disabled={adding}
						className={`w-full mt-4 px-6 py-3 rounded-xl font-bold text-lg border-2 border-cyan-400 transition shadow-cyan-400/30 shadow-lg
							${adding ? "bg-gray-700 text-gray-400" : "bg-cyan-400 text-black hover:bg-cyan-300"}`}
					>
						{adding ? "Adding..." : "Add to Cart"}
					</motion.button>
				</div>
			</motion.div>
		</div>
	);
}
