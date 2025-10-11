"use client";
import { useState } from "react";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { StatsCards } from "./dashboard/StatsCards";
import { TripsSection } from "./dashboard/TripsSection";
import { ChartsSection } from "./dashboard/ChartsSection";
import { TablesSection } from "./dashboard/TablesSection";

export default function TravelDashboard() {

    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
            {/* Sidebar */}

            {/* Main Content */}
            <div className="flex-1">
                <div className="p-8">
                    <DashboardHeader />

                    <StatsCards />

                    <TripsSection />

                    <ChartsSection />

                    <TablesSection />
                </div>
            </div>
        </div>
    );
}
