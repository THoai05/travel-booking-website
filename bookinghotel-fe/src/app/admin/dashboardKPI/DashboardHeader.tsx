import { Search } from "lucide-react";
import { InputText } from "primereact/inputtext";

export function DashboardHeader() {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-gray-900">Welcome Adrian 👋</h1>
                    <p className="text-gray-500 mt-1">
                        Track activity, trends, and popular destinations in real time
                    </p>
                </div>
                <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <InputText
                        placeholder="Search..."
                        className="pl-10 bg-gray-100 border-0 rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}