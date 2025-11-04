"use client";
import { useEffect, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { StatsCards } from "./StatsCards";
import { TripsSection } from "./TripsSection";
import { ChartsSection } from "./ChartsSection";
import { ChartsSectionRevenue } from "./ChartsSectionRevenue";
import { TablesSection } from "./TablesSection";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/axios/axios";

export default function TravelDashboard() {
    const { user } = useAuth();
    const router = useRouter();

    const [stats, setStats] = useState<any>(null); // cho StatsCards
    const [kpiType, setKpiType] = useState<"week" | "month" | "year">("month");

    useEffect(() => {
        if (user?.role !== "admin") {
            router.replace("/");
        }

        const fetchStats = async () => {
            try {
                // API cho StatsCards
                const resStats = await api.get("/bookings/kpiBookingAndCancelledRate?type=" + kpiType);
                setStats(resStats.data.data);

            } catch (error) {
                console.error("Failed to fetch KPI:", error);
            }
        };

        fetchStats();
    }, [user, router, kpiType]);

    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
            <div className="flex-1">
                <div className="p-8">
                    <DashboardHeader />

                    {/* Có thể thêm select Week/Month/Year */}
                    <div className="mb-4 flex gap-2">
                        {["week", "month", "year"].map(type => (
                            <button
                                key={type}
                                className={`px-4 py-1 rounded ${kpiType === type ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                                    }`}
                                onClick={() => setKpiType(type as "week" | "month" | "year")}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    <StatsCards stats={stats} />
                    {/* <TripsSection /> */}
                    <ChartsSection />
                    <ChartsSectionRevenue />
                    {/* <TablesSection /> */}
                </div>
            </div>
        </div>
    );
}
