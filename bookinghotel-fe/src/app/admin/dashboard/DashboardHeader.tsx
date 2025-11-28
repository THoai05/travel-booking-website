import { Search } from "lucide-react";
import { InputText } from "primereact/inputtext";

export function DashboardHeader() {
    return (
        <div className="mb-10">
            <div className="flex items-center justify-between">

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Welcome Adrian 👋</h1>
                    <p className="text-gray-500 mt-1">
                        Track activity, trends, and popular destinations in real time
                    </p>
                </div>

                {/* Search Box */}
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="
            pl-10 pr-4 py-3 w-full
            text-sm
            bg-white border border-gray-300
            rounded-xl
            focus:ring-2 focus:ring-blue-400 focus:border-blue-400
            transition-all duration-200
        "
                    />
                </div>


            </div>
        </div>
    );
}
