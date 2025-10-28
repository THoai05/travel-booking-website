"use client";
import { useState, useMemo, useEffect } from "react";
import { Search, HelpCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus, X, Plane, Activity, MapPin, Hotel, Car, Building2, Ticket } from "lucide-react";
import styles from "../home/css/Faq.module.css";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getAllFaqs } from "@/service/faq/faqService"; // 🟢 Import API thật

interface FAQ {
    id: number;
    question: string;
    answer: string;
    status: string;
    categories: string;
    created_at: string;
    updated_at: string;
}

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [hasError, setHasError] = useState(false);

    const categories = [
        { name: "Tour du lịch", icon: Plane },
        { name: "Hoạt động", icon: Activity },
        { name: "Điểm đến", icon: MapPin },
        { name: "Đặt phòng khách sạn", icon: Hotel },
        { name: "Thuê xe", icon: Car },
        { name: "Bất động sản nghỉ dưỡng", icon: Building2 },
        { name: "Đặt vé", icon: Ticket },
    ];
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);


    // 🟩 Gọi API lấy dữ liệu FAQ từ backend
    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const data = await getAllFaqs();
                setFaqs(data);
            } catch (error) {
                console.error("Lỗi khi tải FAQ:", error);
                setHasError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const filteredFAQs = useMemo(() => {
        let result = faqs;

        // lọc theo category nếu có chọn
        if (selectedCategory) {
            result = result.filter(faq => faq.categories === selectedCategory);
        }

        // lọc theo từ khóa tìm kiếm
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                faq =>
                    faq.question.toLowerCase().includes(query) ||
                    faq.answer.toLowerCase().includes(query)
            );
        }

        return result;
    }, [faqs, searchQuery, selectedCategory]);


    // 🟥 Nếu lỗi
    if (hasError) {
        return (
            <div className="mt-12 container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Không thể tải danh sách câu hỏi, vui lòng thử lại sau.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // 🟨 Khi đang tải
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg text-muted-foreground animate-pulse">Đang tải câu hỏi thường gặp...</p>
            </div>
        );
    }

    return (
        <div className="container mt-12 mx-auto px-4 py-8 max-w-4xl">
            <div className="mt-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">Câu hỏi thường gặp</h2>
                    <p className="text-gray-500">
                        Giải đáp nhanh những thắc mắc phổ biến trước khi bạn khởi hành.
                    </p>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-3 mb-10">
                    {categories.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => setSelectedCategory(selectedCategory === name ? null : name)}
                            className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm transition
        ${selectedCategory === name
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "border-gray-300 hover:bg-gray-100 text-gray-700"}`}
                        >
                            <Icon className={`w-4 h-4 ${selectedCategory === name ? "text-white" : "text-gray-600"}`} />
                            {name}
                        </button>

                    ))}
                </div>
                {/* Search Bar */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm câu hỏi..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12"
                            />
                        </div>
                        {searchQuery && (
                            <p className="mt-3 text-muted-foreground">
                                Tìm thấy <span className="text-foreground font-medium">{filteredFAQs.length}</span> kết quả
                            </p>
                        )}
                    </CardContent>
                </Card>
                {selectedCategory && (
                    <div className="mb-4 text-center">
                        <Badge className="bg-blue-600 text-white">
                            Chủ đề: {selectedCategory}
                        </Badge>
                    </div>
                )}
                {/* FAQ List */}
                {filteredFAQs.length === 0 ? (
                    <Card>
                        <CardContent className="py-16 text-center">
                            <Search className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
                            <h3 className="mb-2 text-lg font-medium">Không tìm thấy câu hỏi phù hợp</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-4">
                                Không có câu hỏi nào khớp với từ khóa "{searchQuery}".
                                Vui lòng thử từ khóa khác hoặc liên hệ bộ phận hỗ trợ để được giúp đỡ.
                            </p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-blue-600 hover:text-blue-700"
                            >
                                Xóa tìm kiếm
                            </button>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Danh sách câu hỏi</CardTitle>
                                <CardDescription>
                                    Nhấp vào câu hỏi để xem câu trả lời chi tiết
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="w-full">
                                    {filteredFAQs.map((faq, index) => (
                                        <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                                            <AccordionTrigger className="text-left hover:no-underline">
                                                <div className="flex items-start gap-3 pr-4">
                                                    <Badge variant="outline" className="mt-0.5 flex-shrink-0">
                                                        {index + 1}
                                                    </Badge>
                                                    <span>{faq.question}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground pl-11 pr-4">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Contact Support */}
                        <Card className="mt-6 bg-blue-50 border-blue-200">
                            <CardContent className="p-6 text-center">
                                <h3 className="mb-2 text-lg font-semibold">Vẫn cần hỗ trợ thêm?</h3>
                                <p className="text-muted-foreground mb-4">
                                    Nếu bạn không tìm thấy câu trả lời, đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ
                                </p>
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                        Liên hệ hỗ trợ
                                    </button>
                                    <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                                        Live Chat
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </div >
    );
}
