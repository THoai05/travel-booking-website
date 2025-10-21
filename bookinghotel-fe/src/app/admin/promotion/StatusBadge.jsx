export default function StatusBadge({ status }) {
    const isActive = status === "active";
    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                }`}
        >
            {isActive ? "Active" : "Inactive"}
        </span>
    );
}
