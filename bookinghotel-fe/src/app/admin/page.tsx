"use client";
import { useEffect, useState } from "react";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatsCards } from "./dashboard/StatsCards";
import { CarouselHotels } from "./dashboard/CarouselHotels";
import { ChartsSection } from "./dashboard/ChartsSection";
import { RevenueCharts } from "./dashboard/ChartsSectionRevenue";
import { TablesSectionKPI } from "./dashboard/TablesSectionKPI";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { CombinedBookingChart } from "./dashboard/CombinedBookingChart";
import { CombinedPaymentStats } from "./dashboard/CombinedPaymentStats";

import { TablesSectionPaymentStats } from "./dashboard/TablesSectionPaymentStats";

import { CarouselPaymentStats } from "./dashboard/CarouselPaymentStats";

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
                    <CarouselHotels />
                    <ChartsSection />
                    <RevenueCharts />
                    <CarouselPaymentStats />
                    <CombinedBookingChart />
                    <CombinedPaymentStats />
                    <TablesSectionKPI />
                    <TablesSectionPaymentStats />
                </div>
            </div>
        </div>
    );
}
