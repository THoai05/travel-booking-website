"use client";

import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getPayments } from "@/service/payment/paymentService";
import { formatDate } from "@/utils/date";

interface PaymentData {
    id: number;
    amount: string;
    currency: string;
    paymentMethod: string;
    paymentStatus: string;
    transactionId: string;
    refundStatus: string;
    paidAt: string | null;
    createdAt: string;
    booking: {
        id: number;
        checkInDate: string;
        checkOutDate: string;
        guestsCount: number;
        status: string;
        contactFullName: string;
        contactEmail: string;
        contactPhone: string;
        guestFullName: string;
        totalPrice: string;
        totalPriceUpdate: string | null;
        specialRequests: string | null;
        cancellationReason: string | null;
        createdAt: string;
        updatedAt: string;
    };
}

export default function PaymentList() {
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await getPayments();
                // API trả về mảng trực tiếp
                const data = Array.isArray(res) ? res : [];
                setPayments(data);
                toast.success("Đã tải danh sách thanh toán!");
            } catch (error) {
                console.error(error);
                toast.error("Lỗi khi gọi API!");
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, []);

    // Filter dữ liệu theo search và status
    const filteredData = useMemo(() => {
        return payments.filter((p) => {
            const matchStatus = statusFilter === "all" || p.paymentStatus === statusFilter;
            const matchSearch =
                searchQuery === "" ||
                p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.booking.id.toString().includes(searchQuery);
            return matchStatus && matchSearch;
        });
    }, [payments, searchQuery, statusFilter]);

    // Export CSV
    const handleExportCSV = () => {
        const csvContent = [
            [
                "ID",
                "Amount",
                "Currency",
                "Method",
                "Status",
                "Transaction ID",
                "Refund",
                "Paid At",
                "Created At",
                "Booking ID",
            ],
            ...filteredData.map((p) => [
                p.id,
                Number(p.amount).toLocaleString("vi-VN"),
                p.currency,
                p.paymentMethod,
                p.paymentStatus,
                p.transactionId,
                p.refundStatus,
                p.paidAt ? formatDate(p.paidAt) : "",
                formatDate(p.createdAt),
                p.booking.id,
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        toast.success("Đã xuất file CSV thành công!");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <p>Đang tải danh sách thanh toán...</p>
            </div>
        );
    }

    const statuses = Array.from(new Set(payments.map((p) => p.paymentStatus)));

    return (
        <div className="p-6 space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-3">
                        <div>
                            <CardTitle>Danh sách thanh toán</CardTitle>
                            <CardDescription>Hiển thị tất cả giao dịch thanh toán</CardDescription>
                        </div>
                        <div className="flex gap-3">
                            <Input
                                placeholder="Tìm kiếm Transaction ID hoặc Booking ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    {statuses.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleExportCSV}>
                                <Download className="mr-2 h-4 w-4" /> Export CSV
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="border rounded-lg overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Số tiền</TableHead>
                                    <TableHead>Tiền tệ</TableHead>
                                    <TableHead>Phương thức</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead>Refund</TableHead>
                                    <TableHead>Paid At</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Booking ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={10} className="text-center py-8">
                                            Không có dữ liệu
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell>{p.id}</TableCell>
                                            <TableCell>{Number(p.amount).toLocaleString("vi-VN")}</TableCell>
                                            <TableCell>{p.currency}</TableCell>
                                            <TableCell>{p.paymentMethod}</TableCell>
                                            <TableCell>{p.paymentStatus}</TableCell>
                                            <TableCell>{p.transactionId}</TableCell>
                                            <TableCell>{p.refundStatus}</TableCell>
                                            <TableCell>{p.paidAt ? formatDate(p.paidAt) : ""}</TableCell>
                                            <TableCell>{formatDate(p.createdAt)}</TableCell>
                                            <TableCell>{p.booking.id}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                        Hiển thị {filteredData.length} / {payments.length} kết quả
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
