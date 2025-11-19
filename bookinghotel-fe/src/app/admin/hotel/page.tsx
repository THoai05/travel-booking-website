"use client";
import useHotels from "./useHotels";

export default function HotelsPage() {
    const { data, page, setPage, total, limit, loading, remove } = useHotels();

    return (
        <div className="p-10 space-y-6">
            <h1 className="text-3xl font-bold">Hotel Management</h1>

            {loading && <p>Loading...</p>}

            <table className="w-full border text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Name</th>
                        <th className="p-2">City</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((hotel) => (
                        <tr key={hotel.id} className="border-b">
                            <td className="p-2">{hotel.id}</td>
                            <td className="p-2">{hotel.name}</td>
                            <td className="p-2">{hotel.city?.name}</td>
                            <td className="p-2 flex gap-3">
                                <a
                                    href={`/admin/hotel/[id]/${hotel.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </a>

                                <button
                                    onClick={() => remove(hotel.id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center gap-4 mt-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Prev
                </button>

                <span>
                    Page {page} / {Math.ceil(total / limit)}
                </span>

                <button
                    disabled={page >= Math.ceil(total / limit)}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
