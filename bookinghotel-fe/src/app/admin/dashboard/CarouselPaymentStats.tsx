"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/axios/axios";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentMethod {
    name: string;
    img: string;
    color: string;
    total: number;
}

interface PaymentStatsData {
    type: "week" | "month" | "year";
    labels: string[];
    paymentData: {
        cod: number[];
        momo: number[];
        vnpay: number[];
        zalopay: number[];
        stripe: number[];
    };
}

function formatVND(value: number) {
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// --- PaymentCard với hiệu ứng pháo hoa ---
function PaymentCard({ method, rank }: { method: PaymentMethod; rank: number | null }) {
    const [showFireworks, setShowFireworks] = useState(false); // state bật/tắt fireworks
    const topColors = ["#FFD700", "#C0C0C0", "#CD7F32"];
    const particleColors = ["#FFD700", "#FF4D4D", "#4DFF4D", "#4D4DFF", "#FF4DFF", "#4DFFFF"];

    return (
        <motion.div
            className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col items-center w-40
            shadow-md relative cursor-pointer overflow-visible"
            onClick={() => setShowFireworks(!showFireworks)} // click để bật/tắt
            whileHover={{ scale: 1.05 }}
        >
            {/* Top badge */}
            {rank !== null && rank <= 3 && (
                <div
                    className="absolute -top-4 z-20 text-white px-2 py-1 rounded font-bold text-xs shadow-lg"
                    style={{ backgroundColor: topColors[rank - 1] }}
                >
                    Top {rank}
                </div>
            )}

            {/* Fireworks chỉ hiện khi click */}
            {showFireworks && rank !== null && rank <= 3 && (
                <motion.div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
                >
                    {Array.from({ length: 25 }).map((_, i) => {
                        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
                        const angle = Math.random() * 2 * Math.PI;
                        const distance = 40 + Math.random() * 50;

                        return (
                            <motion.div
                                key={i}
                                className="absolute w-2 h-2 rounded-full shadow-lg"
                                style={{ backgroundColor: color, filter: "blur(1px)" }}
                                animate={{
                                    x: Math.cos(angle) * distance,
                                    y: Math.sin(angle) * distance,
                                    opacity: [1, 0],
                                    scale: [0.5, 1.5],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    ease: "easeOut",
                                    delay: Math.random() * 0.5,
                                }}
                            />
                        );
                    })}
                </motion.div>
            )}

            {/* Icon */}
            <div className="relative w-16 h-16 mb-3 rounded-full overflow-hidden shadow-md hover:shadow-xl
                transition-all duration-700 ease-out hover:scale-105 hover:rotate-1 hover:brightness-110 z-30"
            >
                <Image src={`/images/${method.img}`} alt={method.name} fill className="object-cover" />
            </div>

            <h3 className="text-gray-900 font-semibold text-sm mb-1">{method.name}</h3>
            <p className="text-lg font-bold" style={{ color: method.color }}>
                {formatVND(method.total)}
            </p>
        </motion.div>
    );
}



export function CarouselPaymentStats() {
    const [paymentStats, setPaymentStats] = useState<PaymentStatsData | null>(null);
    const [currentType, setCurrentType] = useState<"week" | "month" | "year">("week");
    const types: ("week" | "month" | "year")[] = ["week", "month", "year"];
    const AUTO_INTERVAL = 6000;

    

    useEffect(() => {
        fetchData(currentType);
    }, [currentType]);

    useEffect(() => {
        const interval = setInterval(() => {
            const nextType = types[(types.indexOf(currentType) + 1) % types.length];
            setCurrentType(nextType);
        }, AUTO_INTERVAL);
        return () => clearInterval(interval);
    }, [currentType]);

    const fetchData = async (type: "week" | "month" | "year") => {
        try {
            const res = await api.get(`/bookings/payment-stats?type=${type}`);
            setPaymentStats(res.data);
        } catch (error) {
            console.error("Error fetching payment stats:", error);
            setPaymentStats(null);
        }
    };

    if (!paymentStats) return <div>Loading...</div>;

    const totals = [
        { name: "COD", img: "cod.png", color: "#FBBF24", total: paymentStats.paymentData.cod.reduce((a, b) => a + b, 0) },
        { name: "Momo", img: "momo.png", color: "#22C55E", total: paymentStats.paymentData.momo.reduce((a, b) => a + b, 0) },
        { name: "VNPay", img: "vnpay.png", color: "#3B82F6", total: paymentStats.paymentData.vnpay.reduce((a, b) => a + b, 0) },
        { name: "ZaloPay", img: "zalo.png", color: "#F4CCCC", total: paymentStats.paymentData.zalopay?.reduce((a, b) => a + b, 0) ?? 0 },
        { name: "Stripe", img: "stripe.png", color: "#A78BFA", total: paymentStats.paymentData.stripe?.reduce((a, b) => a + b, 0) ?? 0 },
    ];

    // Sắp xếp top
    const sortedMethods = [...totals].sort((a, b) => b.total - a.total);

    return (
        <div className="mb-8">
            <div className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-6">
                <h2 className="text-gray-900 mb-4 font-semibold text-xl">
                    Payment Stats - {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
                </h2>

                <div className="relative overflow-hidden p-5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentType}
                            className="flex justify-center gap-6"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            {sortedMethods.map((method, idx) => (
                                <PaymentCard key={method.name} method={method} rank={idx < 3 ? idx + 1 : null} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    {types.map((t) => (
                        <span
                            key={t}
                            className={`w-3 h-3 rounded-full cursor-pointer ${currentType === t ? "bg-blue-500" : "bg-gray-300"}`}
                            onClick={() => setCurrentType(t)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
