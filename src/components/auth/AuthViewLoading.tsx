"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function AuthViewLoading() {
	return (
		<div className="min-h-screen w-screen bg-[#07090e] flex items-center justify-center relative overflow-hidden">
			{/* Ambient background */}
			<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
			<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />

			<div className="relative flex flex-col items-center">
				{/* Logo */}
				<motion.div
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-[1px] shadow-lg shadow-emerald-500/20"
				>
					<div className="w-full h-full bg-[#090d16] rounded-[15px] flex items-center justify-center">
						<motion.div
							animate={{
								rotate: [0, 360],
								scale: [1, 1.08, 1],
							}}
							transition={{
								rotate: {
									duration: 3,
									repeat: Infinity,
									ease: "linear",
								},
								scale: {
									duration: 1.5,
									repeat: Infinity,
									ease: "easeInOut",
								},
							}}
						>
							<Zap className="w-8 h-8 text-emerald-400" />
						</motion.div>
					</div>
				</motion.div>

				{/* Title */}
				<motion.h1
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15 }}
					className="mt-5 text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400"
				>
					MOMENTUM OS
				</motion.h1>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="text-xs text-slate-500 mt-2"
				>
					Initializing your workspace...
				</motion.p>

				{/* Loading bar */}
				<div className="mt-6 w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
					<motion.div
						className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full"
						initial={{ x: "-100%" }}
						animate={{ x: "100%" }}
						transition={{
							duration: 1.4,
							repeat: Infinity,
							ease: "easeInOut",
						}}
					/>
				</div>
			</div>
		</div>
	);
}
