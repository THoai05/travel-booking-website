import Header from "./Header";
import OverviewCards from "./OverviewCards";
import RevenueChart from "./RevenueChart";
import QuickStats from "./QuickStats";
import BookingTable from "./BookingTable";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Header />
            <OverviewCards />

            <div className="grid grid-cols-3 gap-4 mb-6">
                <RevenueChart />
                <QuickStats />
            </div>

            <BookingTable />
        </div>
    );
}
