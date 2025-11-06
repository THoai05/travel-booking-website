"use client";
import { useEffect, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { StatsCards } from "./StatsCards";
import { TripsSection } from "./TripsSection";
import { ChartsSection } from "./ChartsSection";
import { ChartsSectionRevenue } from "./ChartsSectionRevenue";
import { TablesSectionKPI } from "./TablesSectionKPI";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function TravelDashboard() {
    const { user } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (user?.role !== "admin") {
            router.replace("/");
        }

    }, [user, router]);

    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
            <div className="flex-1">
                <div className="p-8">
                    <DashboardHeader />
                    <StatsCards />
                    {/* <TripsSection /> */}
                    <ChartsSection />
                    <ChartsSectionRevenue />
                    <TablesSectionKPI />
                </div>
            </div>
        </div>
    );
}
