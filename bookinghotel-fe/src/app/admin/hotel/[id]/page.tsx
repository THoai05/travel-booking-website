"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import useHotels from "../useHotels";

export default function EditHotel({ params }) {
    const { update } = useHotels();
    const [form, setForm] = useState({ name: "", cityId: "" });

    useEffect(() => {
        axios.get(`http://localhost:3636/hotels/manage/${params.id}`).then(res => {
            setForm(res.data);
        });
    }, []);

    const submit = async () => {
        await update(params.id, form);
        window.location.href = "/admin/hotels";
    };

    return (
        <div className="p-10 space-y-4">
            <h1 className="text-2xl font-bold">Edit Hotel</h1>

            <input
                value={form.name}
                className="border p-2 w-full"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
                value={form.cityId}
                className="border p-2 w-full"
                onChange={(e) => setForm({ ...form, cityId: e.target.value })}
            />

            <button
                onClick={submit}
                className="px-4 py-2 bg-black text-white rounded"
            >
                Save
            </button>
        </div>
    );
}
