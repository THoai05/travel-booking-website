"use client";
import { useState, useMemo } from "react";
import { Search, HelpCircle, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface FAQ {
    faq_id: number;
    question: string;
    answer: string;
    created_at: string;
    updated_at: string;
    status: 0 | 1; // 1 = Hiển thị, 0 = Ẩn
    admin_id: number;
}

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [hasError, setHasError] = useState(false);

    // Mock data - Danh sách câu hỏi thường gặp
    const faqs: FAQ[] = [
        {
            faq_id: 1,
            question: "Làm thế nào để đặt phòng khách sạn?",
            answer: "Để đặt phòng, bạn chỉ cần: (1) Tìm kiếm khách sạn theo địa điểm mong muốn, (2) Chọn loại phòng phù hợp với nhu cầu, (3) Nhập thông tin cá nhân và thanh toán, (4) Nhận email xác nhận đặt phòng ngay lập tức. Quá trình đặt phòng chỉ mất vài phút và rất đơn giản.",
            created_at: "2024-12-01T10:00:00",
            updated_at: "2025-01-15T14:30:00",
            status: 1,
            admin_id: 1
        },
        {
            faq_id: 2,
            question: "Tôi có thể hủy đặt phòng không? Chính sách hủy như thế nào?",
            answer: "Chính sách hủy phòng tùy thuộc vào từng khách sạn và loại phòng bạn đặt. Thông thường: Hủy miễn phí nếu hủy trước 24-48 giờ so với ngày nhận phòng. Hủy trễ hơn có thể bị tính phí từ 50-100% giá phòng. Một số khách sạn áp dụng chính sách không hoàn tiền. Vui lòng kiểm tra kỹ chính sách hủy trước khi đặt phòng.",
            created_at: "2024-12-01T10:15:00",
            updated_at: "2025-01-10T09:20:00",
            status: 1,
            admin_id: 1
        },
        {
            faq_id: 3,
            question: "Các hình thức thanh toán được chấp nhận là gì?",
            answer: "Chúng tôi chấp nhận nhiều hình thức thanh toán: Thẻ tín dụng/ghi nợ (Visa, MasterCard, JCB, American Express), Chuyển khoản ngân hàng, Ví điện tử (MoMo, ZaloPay, VNPay), Thanh toán tại khách sạn (tùy theo quy định của từng khách sạn). Tất cả giao dịch đều được bảo mật với tiêu chuẩn cao nhất.",
            created_at: "2024-12-05T11:00:00",
            updated_at: "2024-12-20T16:45:00",
            status: 1,
            admin_id: 2
        },
        {
            faq_id: 4,
            question: "Thời gian nhận phòng và trả phòng là khi nào?",
            answer: "Thời gian tiêu chuẩn: Nhận phòng (Check-in): từ 14:00 chiều, Trả phòng (Check-out): trước 12:00 trưa. Một số khách sạn cho phép nhận/trả phòng linh hoạt với phụ phí. Bạn có thể yêu cầu nhận phòng sớm hoặc trả phòng muộn khi đặt phòng (tùy tình trạng phòng trống).",
            created_at: "2024-12-08T13:30:00",
            updated_at: "2025-01-05T10:10:00",
            status: 1,
            admin_id: 1
        },
        {
            faq_id: 5,
            question: "Tôi có cần đặt cọc khi đặt phòng không?",
            answer: "Tùy thuộc vào chính sách của từng khách sạn: Một số khách sạn yêu cầu thanh toán toàn bộ ngay khi đặt, Một số chỉ yêu cầu đặt cọc 30-50% và thanh toán phần còn lại khi nhận phòng, Một số cho phép thanh toán tại khách sạn mà không cần đặt cọc trước. Thông tin chi tiết về đặt cọc sẽ được hiển thị rõ ràng trong quá trình đặt phòng.",
            created_at: "2024-12-10T09:00:00",
            updated_at: "2024-12-28T15:20:00",
            status: 1,
            admin_id: 2
        },
        {
            faq_id: 6,
            question: "Làm thế nào để thay đổi thông tin đặt phòng?",
            answer: "Để thay đổi thông tin đặt phòng: (1) Đăng nhập vào tài khoản của bạn, (2) Vào mục 'Đơn đặt phòng' để xem chi tiết, (3) Chọn 'Chỉnh sửa' để thay đổi ngày, loại phòng hoặc số lượng khách, (4) Lưu thay đổi (có thể phát sinh phụ phí). Lưu ý: Một số đơn đặt phòng không cho phép thay đổi, bạn cần hủy và đặt lại.",
            created_at: "2024-12-12T14:00:00",
            updated_at: "2025-01-08T11:30:00",
            status: 1,
            admin_id: 1
        },
        {
            faq_id: 7,
            question: "Khách sạn có cung cấp dịch vụ đưa đón sân bay không?",
            answer: "Nhiều khách sạn cung cấp dịch vụ đưa đón sân bay với các tùy chọn: Miễn phí (đối với một số hạng phòng cao cấp hoặc thời gian lưu trú dài), Thu phí theo km hoặc chuyến đi, Dịch vụ xe riêng hoặc xe chung. Bạn có thể yêu cầu dịch vụ này trong phần ghi chú khi đặt phòng hoặc liên hệ trực tiếp với khách sạn.",
            created_at: "2024-12-15T10:30:00",
            updated_at: "2025-01-12T09:15:00",
            status: 1,
            admin_id: 2
        },
        {
            faq_id: 8,
            question: "Tôi có thể mang theo thú cưng không?",
            answer: "Chính sách về thú cưng khác nhau tùy khách sạn: Một số khách sạn cho phép mang theo thú cưng với phụ phí, Một số chỉ cho phép thú cưng có trọng lượng dưới một mức nhất định, Một số khách sạn hoàn toàn không cho phép. Vui lòng kiểm tra chính sách cụ thể của khách sạn hoặc liên hệ trước khi đặt phòng để đảm bảo.",
            created_at: "2024-12-18T11:45:00",
            updated_at: "2024-12-30T14:00:00",
            status: 1,
            admin_id: 1
        },
        {
            faq_id: 9,
            question: "Làm sao để nhận ưu đãi và khuyến mãi?",
            answer: "Để nhận ưu đãi tốt nhất: Đăng ký nhận email thông báo để biết các chương trình khuyến mãi mới nhất, Theo dõi trang Promotions trên website, Đặt phòng sớm để được giá ưu đãi Early Bird, Đăng ký thành viên để tích điểm và nhận ưu đãi riêng, Đặt phòng vào các dịp lễ hội có nhiều chương trình giảm giá đặc biệt.",
            created_at: "2024-12-20T13:00:00",
            updated_at: "2025-01-18T10:45:00",
            status: 1,
            admin_id: 2
        },
        {
            faq_id: 10,
            question: "Tôi có thể yêu cầu phòng cụ thể không?",
            answer: "Bạn hoàn toàn có thể yêu cầu: Phòng ở tầng cao/thấp, Phòng view biển/núi/thành phố, Phòng gần/xa thang máy, Phòng kết nối (connecting rooms) cho gia đình. Tuy nhiên, các yêu cầu này chỉ được đáp ứng tùy theo tình trạng phòng trống. Bạn nên ghi rõ yêu cầu trong phần ghi chú khi đặt phòng để khách sạn chuẩn bị tốt nhất có thể.",
            created_at: "2024-12-22T09:30:00",
            updated_at: "2025-01-20T15:30:00",
            status: 1,
            admin_id: 1
        },
        {
            faq_id: 11,
            question: "Khách sạn có cung cấp bữa sáng không?",
            answer: "Tùy theo gói đặt phòng: Một số gói đã bao gồm bữa sáng miễn phí (thường là buffet), Một số gói không bao gồm nhưng bạn có thể mua thêm, Bữa sáng có thể được phục vụ tại nhà hàng khách sạn hoặc giao đến phòng (room service). Thông tin chi tiết về bữa sáng sẽ được hiển thị rõ ràng khi bạn chọn loại phòng.",
            created_at: "2024-12-25T10:00:00",
            updated_at: "2025-01-22T11:00:00",
            status: 1,
            admin_id: 2
        },
        {
            faq_id: 12,
            question: "Tôi cần liên hệ với bộ phận hỗ trợ khách hàng như thế nào?",
            answer: "Bạn có thể liên hệ với chúng tôi qua nhiều kênh: Hotline: 1900-xxxx (hoạt động 24/7), Email: support@bluvera.com, Live Chat: Trên website (góc phải màn hình), Fanpage Facebook: @BlueraHotels, Hoặc gửi yêu cầu hỗ trợ qua trang Support trong tài khoản. Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc.",
            created_at: "2024-12-28T14:30:00",
            updated_at: "2025-01-25T09:00:00",
            status: 1,
            admin_id: 1
        }
    ];

    // Lọc các FAQ đang hiển thị (status = 1)
    const activeFAQs = useMemo(() => {
        return faqs.filter(faq => faq.status === 1);
    }, []);

    // Tìm kiếm FAQ
    const filteredFAQs = useMemo(() => {
        if (!searchQuery.trim()) {
            return activeFAQs;
        }

        const query = searchQuery.toLowerCase().trim();
        return activeFAQs.filter(faq =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        );
    }, [searchQuery, activeFAQs]);

    // Xử lý lỗi khi load dữ liệu
    if (hasError) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Không thể tải danh sách câu hỏi, vui lòng thử lại sau
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mt-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-100 p-4 rounded-full">
                            <HelpCircle className="h-12 w-12 text-blue-600" />
                        </div>
                    </div>
                    <h1 className="mb-3">Câu hỏi thường gặp</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Tìm câu trả lời nhanh chóng cho những thắc mắc phổ biến về dịch vụ đặt phòng khách sạn của chúng tôi
                    </p>
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
                                Tìm thấy <span className="text-foreground">{filteredFAQs.length}</span> kết quả
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* FAQ List */}
                {filteredFAQs.length === 0 ? (
                    <Card>
                        <CardContent className="py-16">
                            <div className="flex flex-col items-center justify-center text-center">
                                <Search className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="mb-2">Không tìm thấy câu hỏi phù hợp</h3>
                                <p className="text-muted-foreground max-w-md mb-4">
                                    Không có câu hỏi nào khớp với từ khóa "{searchQuery}".
                                    Vui lòng thử từ khóa khác hoặc liên hệ bộ phận hỗ trợ để được giúp đỡ.
                                </p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    Xóa tìm kiếm
                                </button>
                            </div>
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
                                        <AccordionItem key={faq.faq_id} value={`item-${faq.faq_id}`}>
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

                        {/* Statistics */}
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-muted-foreground mb-1">
                                            Tổng số câu hỏi thường gặp
                                        </p>
                                        <p>
                                            Cập nhật lần cuối: {new Date(
                                                Math.max(...activeFAQs.map(f => new Date(f.updated_at).getTime()))
                                            ).toLocaleDateString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <HelpCircle className="h-8 w-8 text-blue-600" />
                                        <span className="text-3xl">{activeFAQs.length}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Support */}
                        <Card className="mt-6 bg-blue-50 border-blue-200">
                            <CardContent className="p-6 text-center">
                                <h3 className="mb-2">Vẫn cần hỗ trợ thêm?</h3>
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
        </div>
    );
}
