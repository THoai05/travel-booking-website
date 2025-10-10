"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface AboutContent {
    about_id: number;
    title: string;
    content: string;
    image: string;
    updated_by: number;
    updated_at: string;
    status: number;
    slug: string;
}

export default function AboutPage() {
    const [aboutData, setAboutData] = useState<AboutContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Mock data - sẽ được thay thế bằng API call khi tích hợp Supabase
        const fetchAboutContent = async () => {
            try {
                setLoading(true);

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockData: AboutContent = {
                    about_id: 1,
                    title: "Về Bluvera - Nền tảng đặt phòng khách sạn hàng đầu",
                    content: `
            <h2>Giới thiệu về Bluvera</h2>
            <p>Bluvera là nền tảng đặt phòng khách sạn trực tuyến hàng đầu Việt Nam, được thành lập từ năm 2020 với sứ mệnh kết nối hàng triệu du khách với các khách sạn, resort và homestay trên toàn quốc. Chúng tôi mang đến trải nghiệm đặt phòng nhanh chóng, tiện lợi và đáng tin cậy.</p>
            
            <h3>Tầm nhìn</h3>
            <p>Trở thành nền tảng đặt phòng du lịch số 1 khu vực Đông Nam Á, là cầu nối tin cậy giữa du khách và các cơ sở lưu trú, góp phần phát triển ngành du lịch Việt Nam.</p>
            
            <h3>Sứ mệnh</h3>
            <p>Chúng tôi cam kết:</p>
            <ul>
              <li>Cung cấp nền tảng đặt phòng dễ sử dụng, minh bạch và an toàn</li>
              <li>Đảm bảo giá tốt nhất và nhiều ưu đãi hấp dẫn cho khách hàng</li>
              <li>Hỗ trợ các đối tác khách sạn tối ưu hóa doanh thu và quản lý hiệu quả</li>
              <li>Không ngừng đổi mới công nghệ để nâng cao trải nghiệm người dùng</li>
            </ul>
            
            <h3>Dịch vụ của chúng tôi</h3>
            <p>Bluvera cung cấp giải pháp toàn diện cho việc đặt phòng khách sạn:</p>
            <ul>
              <li><strong>Tìm kiếm & So sánh:</strong> Hơn 50,000+ khách sạn, resort, homestay trên toàn quốc với công cụ lọc thông minh</li>
              <li><strong>Đặt phòng nhanh chóng:</strong> Xác nhận đặt phòng ngay lập tức, thanh toán an toàn đa dạng phương thức</li>
              <li><strong>Giá tốt nhất:</strong> Cam kết hoàn tiền nếu tìm được giá rẻ hơn, chương trình ưu đãi độc quyền</li>
              <li><strong>Đánh giá chân thực:</strong> Hệ thống review từ khách hàng thực tế, giúp lựa chọn đúng đắn</li>
              <li><strong>Hỗ trợ 24/7:</strong> Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ mọi lúc, mọi nơi</li>
            </ul>
            
            <h3>Lợi ích cho đối tác khách sạn</h3>
            <p>Tham gia Bluvera, khách sạn của bạn sẽ nhận được:</p>
            <ul>
              <li>Tiếp cận hàng triệu khách hàng tiềm năng</li>
              <li>Hệ thống quản lý đặt phòng hiện đại, tự động hóa</li>
              <li>Báo cáo doanh thu chi tiết, phân tích xu hướng thị trường</li>
              <li>Hỗ trợ marketing, quảng bá thương hiệu</li>
              <li>Thanh toán nhanh chóng, minh bạch</li>
            </ul>
            
            <h3>Thành tựu đạt được</h3>
            <p>Sau 5 năm hoạt động, Bluvera tự hào với những con số ấn tượng:</p>
            <ul>
              <li><strong>5 triệu+</strong> người dùng đăng ký</li>
              <li><strong>50,000+</strong> khách sạn và cơ sở lưu trú đối tác</li>
              <li><strong>10 triệu+</strong> đêm phòng được đặt thành công</li>
              <li><strong>4.8/5</strong> điểm đánh giá từ người dùng</li>
              <li><strong>Top 3</strong> nền tảng booking uy tín nhất Việt Nam 2024</li>
              <li>Giải thưởng "Best Travel Tech Startup" 2023</li>
            </ul>
            
            <h3>Cam kết của chúng tôi</h3>
            <p>Bluvera luôn đặt lợi ích của khách hàng và đối tác lên hàng đầu. Chúng tôi không ngừng cải tiến dịch vụ, đảm bảo mọi chuyến đi của bạn đều trở nên dễ dàng và đáng nhớ hơn.</p>
          `,
                    image: "https://images.unsplash.com/photo-1455587734955-081b22074882",
                    updated_by: 1,
                    updated_at: new Date().toISOString(),
                    status: 1,
                    slug: "ve-chung-toi"
                };

                setAboutData(mockData);
                setError(null);
            } catch (err) {
                setError("Không thể tải nội dung giới thiệu. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchAboutContent();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Skeleton className="h-12 w-3/4 mb-6" />
                    <Skeleton className="h-64 w-full mb-6" />
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (!aboutData || aboutData.status !== 1) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Nội dung giới thiệu hiện không khả dụng.</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <Card className="overflow-hidden border border-gray-200">
                    <CardContent className="p-0">
                        {aboutData.image && (
                            <div className="w-full h-96 overflow-hidden">
                                <Image
                                    src={aboutData.image}
                                    alt={aboutData.title}
                                    width={700}
                                    height={700}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            <h1 className="mb-6">{aboutData.title}</h1>

                            <div
                                className="prose prose-lg max-w-none"
                                dangerouslySetInnerHTML={{ __html: aboutData.content }}
                                style={{
                                    lineHeight: '1.8',
                                }}
                            />

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <p className="text-sm text-gray-500">
                                    Cập nhật lần cuối: {new Date(aboutData.updated_at).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
