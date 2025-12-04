"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import {
    AlertCircle, Users, Hotel, Star, Award, TrendingUp, Shield,
    Search, CreditCard, CheckCircle, MessageCircle, Lock, Zap,
    BarChart3, Globe, Smartphone, HeartHandshake
} from 'lucide-react';

interface AboutContent {
    about_id: number;
    title: string;
    content: string;
    video: string;
    updated_by: number;
    updated_at: string;
    status: number;
    slug: string;
}

const statsData = [
    { icon: Users, value: '5 triệu+', label: 'Người dùng', color: 'from-blue-500 to-cyan-500' },
    { icon: Hotel, value: '50,000+', label: 'Khách sạn đối tác', color: 'from-purple-500 to-pink-500' },
    { icon: Star, value: '10 triệu+', label: 'Đêm phòng đặt thành công', color: 'from-orange-500 to-red-500' },
    { icon: Award, value: '4.8/5', label: 'Đánh giá từ người dùng', color: 'from-green-500 to-emerald-500' },
];

const howItWorksSteps = [
    {
        step: '01',
        title: 'Tìm kiếm & So sánh',
        description: 'Dễ dàng tìm kiếm hơn 50,000+ khách sạn trên khắp Việt Nam. Sử dụng bộ lọc thông minh theo giá, vị trí, tiện ích và đánh giá để tìm nơi lưu trú hoàn hảo.',
        icon: Search,
        image: 'https://images.unsplash.com/photo-1663147737123-9cbd239fc3b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMGJvb2tpbmclMjBhcHAlMjBtb2JpbGV8ZW58MXx8fHwxNzYwNTk5MjExfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        step: '02',
        title: 'Đặt phòng nhanh chóng',
        description: 'Quy trình đặt phòng đơn giản chỉ trong 3 bước. Chọn phòng, điền thông tin và xác nhận. Nhận email xác nhận ngay lập tức.',
        icon: CheckCircle,
        image: 'https://images.unsplash.com/photo-1759038085950-1234ca8f5fed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJlY2VwdGlvbiUyMGRlc2t8ZW58MXx8fHwxNzYwNTEwNTY5fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        step: '03',
        title: 'Thanh toán an toàn',
        description: 'Đa dạng phương thức thanh toán: thẻ tín dụng, ví điện tử, chuyển khoản. Mọi giao dịch được mã hóa và bảo mật tuyệt đối.',
        icon: CreditCard,
        image: 'https://images.unsplash.com/photo-1758411897888-3ca658535fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2MDU5MjQ4Nnww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
        step: '04',
        title: 'Trải nghiệm tuyệt vời',
        description: 'Check-in dễ dàng với mã đặt phòng. Hỗ trợ 24/7 trong suốt hành trình. Chia sẻ đánh giá và nhận phần thưởng cho lần đặt phòng tiếp theo.',
        icon: Star,
        image: 'https://images.unsplash.com/photo-1723902281477-fc5a683354e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHRyYXZlbGVyJTIwc3VpdGNhc2V8ZW58MXx8fHwxNzYwNTk5MjEyfDA&ixlib=rb-4.1.0&q=80&w=1080'
    }
];

const features = [
    {
        icon: Search,
        title: 'Tìm kiếm thông minh',
        description: 'AI-powered search giúp bạn tìm khách sạn phù hợp nhất với nhu cầu'
    },
    {
        icon: Zap,
        title: 'Đặt phòng tức thì',
        description: 'Xác nhận đặt phòng trong vài giây, không cần chờ đợi'
    },
    {
        icon: Lock,
        title: 'Bảo mật tuyệt đối',
        description: 'Mã hóa SSL 256-bit, tuân thủ chuẩn PCI DSS'
    },
    {
        icon: MessageCircle,
        title: 'Hỗ trợ 24/7',
        description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng mọi lúc'
    },
    {
        icon: BarChart3,
        title: 'Phân tích thông minh',
        description: 'Dashboard cho đối tác với insights và analytics chi tiết'
    },
    {
        icon: Globe,
        title: 'Đa ngôn ngữ',
        description: 'Hỗ trợ tiếng Việt, English và 5+ ngôn ngữ khác'
    },
];

const technologies = [
    {
        icon: Smartphone,
        title: 'Mobile-First Design',
        description: 'Giao diện responsive hoàn hảo trên mọi thiết bị, tối ưu cho mobile',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        icon: Zap,
        title: 'Real-time Updates',
        description: 'Cập nhật tình trạng phòng và giá cả theo thời gian thực',
        color: 'from-purple-500 to-pink-500'
    },
    {
        icon: Lock,
        title: 'Security First',
        description: 'Bảo mật đa lớp, mã hóa end-to-end cho mọi giao dịch',
        color: 'from-green-500 to-emerald-500'
    },
    {
        icon: BarChart3,
        title: 'Big Data Analytics',
        description: 'Phân tích dữ liệu lớn để đưa ra gợi ý phù hợp nhất',
        color: 'from-orange-500 to-red-500'
    }
];

const achievements = [
    {
        icon: TrendingUp,
        title: 'Top 3 nền tảng booking uy tín nhất Việt Nam 2024',
        color: 'text-blue-600'
    },
    {
        icon: Award,
        title: 'Giải thưởng "Best Travel Tech Startup" 2023',
        color: 'text-purple-600'
    },
    {
        icon: Shield,
        title: 'Chứng nhận an toàn dữ liệu quốc tế ISO 27001',
        color: 'text-green-600'
    },
];

export default function AboutPage() {
    const [aboutData, setAboutData] = useState<AboutContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAboutContent = async () => {
            try {
                setLoading(true);

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockData: AboutContent & { video?: string } = {
                    about_id: 1,
                    title: "Về Bluvera - Nền tảng đặt phòng khách sạn hàng đầu",
                    content: `<p>Bluvera là nền tảng đặt phòng khách sạn trực tuyến...</p>`,
                    video: "/video/AboutUs.mp4",
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Nội dung giới thiệu hiện không khả dụng.</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative h-[600px] overflow-hidden"
            >
                {aboutData.video && (
                    <video
                        src={aboutData.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />

            </motion.div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                {/* Stats Cards */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-16 mb-20 relative z-10"
                >
                    {statsData.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        >
                            <Card className="bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
                                <CardContent className="p-6">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-gray-500 mb-1">{stat.label}</div>
                                    <div className="text-gray-900">{stat.value}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mission Statement */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
                        <CardContent className="p-12">
                            <h2 className="mb-6">Sứ mệnh của chúng tôi</h2>
                            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                                Trở thành nền tảng đặt phòng du lịch số 1 khu vực Đông Nam Á, là cầu nối tin cậy giữa du khách và các cơ sở lưu trú, góp phần phát triển ngành du lịch Việt Nam bằng công nghệ và đổi mới.
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* How It Works Section */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1.2, type: "spring", duration: 0.8 }}
                            className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full mb-4"
                        >
                            Quy trình đơn giản
                        </motion.div>
                        <h2 className="mb-4">Cách thức hoạt động</h2>
                        <p className="text-xl text-gray-600">Chỉ 4 bước để trải nghiệm kỳ nghỉ hoàn hảo</p>
                    </div>

                    <div className="space-y-24">
                        {howItWorksSteps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: index * 0.2 }}
                            >
                                <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                                    <div className="flex-1">
                                        <Card className="shadow-2xl border-0 overflow-hidden h-full">
                                            <div className="relative h-80 overflow-hidden group">
                                                <Image
                                                    src={step.image}
                                                    alt={step.title}
                                                    width={200}
                                                    height={100}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                            </div>
                                        </Card>
                                    </div>

                                    <div className="flex-1">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.3 + index * 0.2, type: "spring", duration: 0.8 }}
                                            className="inline-block mb-4"
                                        >
                                            <span className="text-6xl bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent opacity-20">
                                                {step.step}
                                            </span>
                                        </motion.div>

                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                                <step.icon className="w-8 h-8 text-white" />
                                            </div>
                                            <h3 className="m-0">{step.title}</h3>
                                        </div>

                                        <p className="text-xl text-gray-600 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Technology Platform Section */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", duration: 0.8 }}
                            className="inline-block px-6 py-2 bg-purple-100 text-purple-600 rounded-full mb-4"
                        >
                            Công nghệ tiên tiến
                        </motion.div>
                        <h2 className="mb-4">Nền tảng công nghệ</h2>
                        <p className="text-xl text-gray-600">Xây dựng trên những công nghệ hiện đại nhất</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {technologies.map((tech, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            >
                                <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden relative">
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tech.color} opacity-10 rounded-bl-full`} />
                                    <CardContent className="p-8 relative z-10">
                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tech.color} flex items-center justify-center mb-6`}>
                                            <tech.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="mb-3">{tech.title}</h3>
                                        <p className="text-gray-600 text-lg">{tech.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Customer Experience Section */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <Card className="shadow-2xl border-0 overflow-hidden">
                                <div className="relative h-96 overflow-hidden group">
                                    <Image
                                        src="https://images.unsplash.com/photo-1758519290233-a03c1d17ecc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHNlcnZpY2UlMjBzdXBwb3J0fGVufDF8fHx8MTc2MDU1MTM4NXww&ixlib=rb-4.1.0&q=80&w=1080"
                                        alt="Customer Service"
                                        width={200}
                                        height={100}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            </Card>
                        </motion.div>

                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-6 py-2 bg-green-100 text-green-600 rounded-full mb-6">
                                Trải nghiệm khách hàng
                            </div>
                            <h2 className="mb-6">Hỗ trợ tận tâm 24/7</h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Đội ngũ chăm sóc khách hàng chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi. Từ tư vấn chọn khách sạn đến giải quyết vấn đề phát sinh, chúng tôi cam kết mang đến trải nghiệm tốt nhất.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: MessageCircle, text: 'Live chat hỗ trợ tức thì' },
                                    { icon: HeartHandshake, text: 'Tư vấn chuyên nghiệp và nhiệt tình' },
                                    { icon: Shield, text: 'Cam kết bảo vệ quyền lợi khách hàng' }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ x: 20, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <p className="text-lg text-gray-700">{item.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Our Team Section */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-2 lg:order-1"
                        >
                            <div className="inline-block px-6 py-2 bg-orange-100 text-orange-600 rounded-full mb-6">
                                Đội ngũ của chúng tôi
                            </div>
                            <h2 className="mb-6">Passion & Innovation</h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Đội ngũ Bluvera gồm hơn 200 chuyên gia công nghệ, du lịch và dịch vụ khách hàng. Chúng tôi đam mê công việc và cam kết mang đến những giải pháp sáng tạo nhất cho ngành du lịch Việt Nam.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { value: '200+', label: 'Nhân viên' },
                                    { value: '50+', label: 'Kỹ sư công nghệ' },
                                    { value: '30+', label: 'Chuyên gia du lịch' },
                                    { value: '24/7', label: 'Hỗ trợ khách hàng' }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                                    >
                                        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-white">
                                            <CardContent className="p-6 text-center">
                                                <div className="text-orange-600 mb-1">{item.value}</div>
                                                <div className="text-gray-600">{item.label}</div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-1 lg:order-2"
                        >
                            <Card className="shadow-2xl border-0 overflow-hidden">
                                <div className="relative h-96 overflow-hidden group">
                                    <Image
                                        src="https://images.unsplash.com/photo-1690264421892-46e3af5c3455?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NjA1MDA1OTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                        alt="Our Team"
                                        width={200}
                                        height={100}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h2 className="mb-4">Tính năng nổi bật</h2>
                        <p className="text-xl text-gray-600">Những gì làm nên sự khác biệt của Bluvera</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            >
                                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white">
                                    <CardContent className="p-6">
                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                                            <feature.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="mb-3">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Achievements Section */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h2 className="mb-4">Thành tựu đạt được</h2>
                        <p className="text-xl text-gray-600">Những cột mốc đáng tự hào của Bluvera</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {achievements.map((achievement, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15, duration: 0.5 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            >
                                <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                                    <CardContent className="p-8 text-center">
                                        <motion.div
                                            initial={{ rotate: -180, opacity: 0 }}
                                            whileInView={{ rotate: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + index * 0.15, duration: 0.8 }}
                                        >
                                            <achievement.icon className={`w-16 h-16 mx-auto mb-4 ${achievement.color}`} />
                                        </motion.div>
                                        <p className="text-gray-700">{achievement.title}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Partner Benefits CTA */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-purple-600 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full translate-y-32 -translate-x-32"></div>

                        <CardContent className="p-8 md:p-12 relative z-10">
                            <div className="max-w-4xl mx-auto text-center">
                                <h2 className="text-white mb-6">Trở thành đối tác của Bluvera</h2>
                                <p className="text-xl text-white/90 mb-8">
                                    Tham gia cùng hơn 50,000+ khách sạn và cơ sở lưu trú đang phát triển mạnh mẽ cùng Bluvera
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {[
                                        { icon: Users, text: 'Tiếp cận hàng triệu khách hàng tiềm năng' },
                                        { icon: BarChart3, text: 'Báo cáo doanh thu chi tiết, phân tích xu hướng' },
                                        { icon: Zap, text: 'Hệ thống quản lý hiện đại, tự động hóa' }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ y: 20, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                                            className="flex flex-col items-center"
                                        >
                                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 border border-white/30">
                                                <item.icon className="w-8 h-8 text-white" />
                                            </div>
                                            <p className="text-white/95">{item.text}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white text-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    Đăng ký trở thành đối tác
                                </motion.button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-12 text-center"
                >
                    <Card className="shadow-md border-0 bg-white/80 backdrop-blur">
                        <CardContent className="p-6">
                            <p className="text-gray-600 mb-2">
                                Bluvera luôn đặt lợi ích của khách hàng và đối tác lên hàng đầu. Chúng tôi không ngừng cải tiến dịch vụ, đảm bảo mọi chuyến đi của bạn đều trở nên dễ dàng và đáng nhớ hơn.
                            </p>
                            <p className="text-sm text-gray-500">
                                Cập nhật lần cuối: {new Date(aboutData.updated_at).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
