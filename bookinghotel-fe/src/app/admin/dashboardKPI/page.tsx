"use client";
import { useEffect, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { StatsCards } from "./StatsCards";
import { CarouselHotels } from "./CarouselHotels";
import { ChartsSection } from "./ChartsSection";
import { ChartsSectionRevenue } from "./ChartsSectionRevenue";
import { TablesSectionKPI } from "./TablesSectionKPI";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { CombinedBookingChart } from "./CombinedBookingChart";
import { CombinedPaymentStats } from "./CombinedPaymentStats";

import { TablesSectionPaymentStats } from "./TablesSectionPaymentStats";

import { CarouselPaymentStats } from "./CarouselPaymentStats";

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
                    <ChartsSectionRevenue />
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
