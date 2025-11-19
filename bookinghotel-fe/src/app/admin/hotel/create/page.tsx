"use client";
import { useState } from "react";
import useHotels from "../useHotels";

export default function CreateHotelPage() {
    const { create } = useHotels();
    const [form, setForm] = useState({ name: "", cityId: "" });

    const submit = async () => {
        await create(form);
        window.location.href = "/admin/hotels";
    };

    return (
        <div className="p-10 space-y-4">
            <h1 className="text-2xl font-bold">Create Hotel</h1>

            <input
                placeholder="Hotel name"
                className="border p-2 w-full"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
                placeholder="City ID"
                className="border p-2 w-full"
                onChange={(e) => setForm({ ...form, cityId: e.target.value })}
            />

            <button
                onClick={submit}
                className="px-4 py-2 bg-black text-white rounded"
            >
                Create
            </button>
        </div>
    );
}
