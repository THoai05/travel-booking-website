"use client";
import { useEffect, useState } from "react";
import { CombinedUserChart } from "./CombinedUserChart";
import { TablesSectionUser } from "./TablesSectionUserAvailability";
import { TablesSectionUser2 } from "./TablesSectionUser2";

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
                    <CombinedUserChart />
                    <TablesSectionUser />

                    <TablesSectionUser2 />

                </div>
            </div>
        </div>
    );
}
