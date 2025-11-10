"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/axios/axios";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentMethod {
    name: string;
    img: string; // file name trong public/images
    color: string; // màu chữ
    total: number;
}

interface PaymentStatsData {
    type: "week" | "month" | "year";
    labels: string[];
    paymentData: {
        cod: number[];
        momo: number[];
        vnpay: number[];
        zalopay: number[]; // mới
        stripe: number[];  // mới
    };
}

function formatVND(value: number) {
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

function PaymentCard({ method }: { method: PaymentMethod }) {
    return (
        <div className="bg-white rounded-[5px] border border-gray-200 p-3 flex flex-col items-center justify-center w-40
    shadow-[0_8px_12px_-2px_rgba(0,0,0,0.1),0_3px_4px_-1px_rgba(0,0,0,0.05)]
    hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)]
    transition-all duration-500">
            <div className="relative w-16 h-16 mb-3 overflow-hidden rounded-full shadow-md hover:shadow-xl
          transition-all duration-700 ease-out hover:scale-105 hover:rotate-1 hover:brightness-110">
                <Image
                    src={`/images/${method.img}`}
                    alt={method.name}
                    fill
                    className="object-cover"
                />
            </div>

            <h3 className="text-gray-900 font-semibold text-sm mb-1">{method.name}</h3>
            <p className="text-lg font-bold" style={{ color: method.color }}>
                {formatVND(method.total)}
            </p>
        </div>
    );
}



export function CarouselPaymentStats() {
    const [paymentStats, setPaymentStats] = useState<PaymentStatsData | null>(null);
    const [currentType, setCurrentType] = useState<"week" | "month" | "year">("week");
    const types: ("week" | "month" | "year")[] = ["week", "month", "year"];
    const AUTO_INTERVAL = 6000; // 6 giây

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

    const totalCOD = paymentStats.paymentData.cod.reduce((a, b) => a + b, 0);
    const totalMomo = paymentStats.paymentData.momo.reduce((a, b) => a + b, 0);
    const totalVNPay = paymentStats.paymentData.vnpay.reduce((a, b) => a + b, 0);
    const totalZalo = paymentStats.paymentData.zalopay?.reduce((a, b) => a + b, 0) ?? 0;
    const totalStripe = paymentStats.paymentData.stripe?.reduce((a, b) => a + b, 0) ?? 0;

    const methods: PaymentMethod[] = [
        { name: "COD", img: "cod.png", color: "#FBBF24", total: totalCOD },
        { name: "Momo", img: "momo.png", color: "#22C55E", total: totalMomo },
        { name: "VNPay", img: "vnpay.png", color: "#3B82F6", total: totalVNPay },
        { name: "ZaloPay", img: "zalo.png", color: "#F4CCCC", total: totalZalo }, // mới
        { name: "Stripe", img: "stripe.png", color: "#A78BFA", total: totalStripe }, // mới
    ];

    return (
        <div className="mb-8">
            <div className="bg-white border-2 border-dashed border-blue-300 rounded-xl p-6">
                <h2 className="text-gray-900 mb-4 font-semibold text-xl">
                    Payment Stats - {currentType.charAt(0).toUpperCase() + currentType.slice(1)}
                </h2>

                <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentType}
                            className="flex justify-center gap-6"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                            {methods.map((method) => (
                                <PaymentCard key={method.name} method={method} />
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    {types.map((t) => (
                        <span
                            key={t}
                            className={`w-3 h-3 rounded-full cursor-pointer ${currentType === t ? "bg-blue-500" : "bg-gray-300"
                                }`}
                            onClick={() => setCurrentType(t)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
