"use client";
import { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { StatsCards } from "./StatsCards";
import { TripsSection } from "./TripsSection";
import { ChartsSection } from "./ChartsSection";
import { TablesSection } from "./TablesSection";

export default function TravelDashboard() {
    const [activeTab, setActiveTab] = useState("Dashboard");

    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
            {/* Sidebar */}

            {/* Main Content */}
            <div className="flex-1 ml-[240px]">
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