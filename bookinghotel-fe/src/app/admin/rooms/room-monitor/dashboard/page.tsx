"use client";
import { useEffect, useState } from "react";
import { CombinedBookingChart } from "./CombinedBookingChart";
import { TablesSectionRoomAvailability } from "./TablesSectionRoomAvailability";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function TravelDashboard() {

    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const checkIsAdmin = user?.role === "admin"
        if (!checkIsAdmin) {
            router.replace('/')
        }
    })

    return (
        <div className="flex min-h-screen bg-[#f5f7fa]">
            {/* Sidebar */}

            {/* Main Content */}
            <div className="flex-1">
                <div className="p-8">
                    <CombinedBookingChart />
                    <TablesSectionRoomAvailability />
                </div>
            </div>
        </div>
    );
}
