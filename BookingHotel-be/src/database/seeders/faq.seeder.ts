import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Faq } from '../../managements/faq/entities/faq.entity';

export default class FaqSeeder implements Seeder {
    public async run(dataSource: DataSource): Promise<void> {
        const faqRepository = dataSource.getRepository(Faq);

        const faqs = [
            // 🧭 Tour du lịch (7)
            {
                question: 'Tôi có thể hủy tour đã đặt không?',
                answer: 'Bạn có thể hủy tour trước 3 ngày khởi hành để được hoàn tiền 80%.',
                categories: 'Tour du lịch',
                status: 'active',
            },
            {
                question: 'Nếu tour bị hủy do thời tiết xấu, tôi có được hoàn tiền không?',
                answer: 'Nếu tour bị hủy do yếu tố khách quan, bạn sẽ được hoàn tiền 100%.',
                categories: 'Tour du lịch',
                status: 'active',
            },
            {
                question: 'Tour có bao gồm hướng dẫn viên không?',
                answer: 'Tất cả các tour đều có hướng dẫn viên chuyên nghiệp đi cùng đoàn.',
                categories: 'Tour du lịch',
                status: 'active',
            },
            {
                question: 'Tôi có thể thay đổi ngày khởi hành tour sau khi đặt không?',
                answer: 'Bạn có thể thay đổi ngày nếu còn chỗ và thông báo trước 48 giờ.',
                categories: 'Tour du lịch',
                status: 'active',
            },
            {
                question: 'Tour có bao gồm bữa ăn và vé tham quan không?',
                answer: 'Tùy vào loại tour, một số tour sẽ bao gồm cả bữa ăn và vé tham quan.',
                categories: 'Tour du lịch',
                status: 'active',
            },
            {
                question: 'Tôi có thể đặt tour cho nhóm đông người không?',
                answer: 'Có, chúng tôi hỗ trợ đặt tour nhóm và có chính sách giảm giá đặc biệt.',
                categories: 'Tour du lịch',
                status: 'active',
            },
            {
                question: 'Có tour nào phù hợp cho gia đình có trẻ nhỏ không?',
                answer: 'Chúng tôi có nhiều tour gia đình thân thiện, phù hợp cho trẻ em.',
                categories: 'Tour du lịch',
                status: 'active',
            },

            // 🎯 Hoạt động (7)
            {
                question: 'Làm thế nào để biết hoạt động còn chỗ trống?',
                answer: 'Bạn có thể kiểm tra trực tiếp trên trang chi tiết hoạt động trước khi đặt.',
                categories: 'Hoạt động',
                status: 'active',
            },
            {
                question: 'Tôi có thể thanh toán vé hoạt động bằng thẻ quốc tế không?',
                answer: 'Chúng tôi chấp nhận Visa, MasterCard và các ví điện tử phổ biến.',
                categories: 'Hoạt động',
                status: 'active',
            },
            {
                question: 'Hoạt động có hoàn tiền nếu tôi không tham gia được không?',
                answer: 'Nếu bạn thông báo trước 24h, có thể hoàn 50% phí hoạt động.',
                categories: 'Hoạt động',
                status: 'active',
            },
            {
                question: 'Có giới hạn độ tuổi cho các hoạt động mạo hiểm không?',
                answer: 'Có, hoạt động mạo hiểm yêu cầu người tham gia từ 16 tuổi trở lên.',
                categories: 'Hoạt động',
                status: 'active',
            },
            {
                question: 'Tôi có thể đặt hoạt động riêng tư hoặc theo nhóm nhỏ không?',
                answer: 'Có, bạn có thể chọn chế độ nhóm riêng khi đặt hoạt động.',
                categories: 'Hoạt động',
                status: 'active',
            },
            {
                question: 'Thời gian diễn ra hoạt động có thể thay đổi không?',
                answer: 'Thời gian có thể điều chỉnh linh hoạt theo điều kiện thời tiết.',
                categories: 'Hoạt động',
                status: 'active',
            },
            {
                question: 'Tôi cần mang theo gì khi tham gia hoạt động?',
                answer: 'Hãy mang theo giấy tờ tùy thân và các vật dụng cá nhân cần thiết.',
                categories: 'Hoạt động',
                status: 'active',
            },

            // 🏝️ Điểm đến (7)
            {
                question: 'Làm sao để tìm điểm đến phù hợp với sở thích của tôi?',
                answer: 'Hãy sử dụng bộ lọc tìm kiếm để chọn điểm đến theo chủ đề bạn thích.',
                categories: 'Điểm đến',
                status: 'active',
            },
            {
                question: 'Có thể xem hình ảnh thực tế của điểm đến không?',
                answer: 'Mỗi điểm đến đều có thư viện ảnh và video thực tế được cập nhật thường xuyên.',
                categories: 'Điểm đến',
                status: 'active',
            },
            {
                question: 'Tôi có thể xem thời tiết của điểm đến trước khi đặt không?',
                answer: 'Chúng tôi hiển thị thông tin thời tiết 7 ngày gần nhất cho mỗi điểm đến.',
                categories: 'Điểm đến',
                status: 'active',
            },
            {
                question: 'Làm thế nào để biết điểm đến có an toàn không?',
                answer: 'Tất cả điểm đến đều được kiểm duyệt và đánh giá bởi người dùng thật.',
                categories: 'Điểm đến',
                status: 'active',
            },
            {
                question: 'Có dịch vụ đưa đón sân bay tại điểm đến không?',
                answer: 'Một số điểm đến cung cấp dịch vụ đón sân bay, bạn có thể chọn khi đặt.',
                categories: 'Điểm đến',
                status: 'active',
            },
            {
                question: 'Tôi có thể lưu danh sách điểm đến yêu thích không?',
                answer: 'Có, bạn có thể thêm điểm đến vào danh sách yêu thích của mình.',
                categories: 'Điểm đến',
                status: 'active',
            },
            {
                question: 'Hệ thống có gợi ý các điểm đến gần nhau không?',
                answer: 'Khi bạn chọn 1 điểm đến, hệ thống sẽ tự động gợi ý các điểm gần đó.',
                categories: 'Điểm đến',
                status: 'active',
            },

            // 🏨 Đặt phòng khách sạn (10)
            {
                question: 'Làm thế nào để biết phòng còn trống?',
                answer: 'Bạn có thể xem tình trạng phòng trực tiếp trong chi tiết khách sạn.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },
            {
                question: 'Tôi có thể hủy hoặc thay đổi đặt phòng sau khi thanh toán không?',
                answer: 'Tùy khách sạn, chính sách hủy sẽ hiển thị rõ khi bạn đặt phòng.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },
            {
                question: 'Nếu tôi đến muộn giờ check-in có bị hủy phòng không?',
                answer: 'Bạn nên thông báo trước, nếu không phòng có thể bị hủy sau 6 giờ tối.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },
            {
                question: 'Giá phòng đã bao gồm thuế và phí dịch vụ chưa?',
                answer: 'Giá hiển thị đã bao gồm thuế, chưa bao gồm phí phụ thu nếu có.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },
            {
                question: 'Tôi có thể đặt phòng cho người khác không?',
                answer: 'Có, bạn chỉ cần nhập thông tin người nhận phòng chính xác.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },
            {
                question: 'Khách sạn có phục vụ ăn sáng miễn phí không?',
                answer: 'Một số khách sạn cung cấp bữa sáng miễn phí, vui lòng kiểm tra chi tiết.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },
            {
                question: 'Làm thế nào để thanh toán an toàn?',
                answer: 'Hệ thống sử dụng mã hóa SSL để bảo vệ thông tin thanh toán của bạn.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },
            {
                question: 'Tôi có thể yêu cầu loại giường cụ thể không?',
                answer: 'Có, bạn có thể chọn giường đôi, giường đơn hoặc giường king khi đặt.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },
            {
                question: 'Có chính sách giảm giá cho khách hàng thân thiết không?',
                answer: 'Chúng tôi có chương trình ưu đãi đặc biệt cho khách hàng thường xuyên.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },
            {
                question: 'Làm thế nào để nhận hóa đơn VAT cho đơn đặt phòng?',
                answer: 'Bạn có thể yêu cầu hóa đơn trong phần “Chi tiết đặt phòng”.',
                categories: 'Đặt phòng khách sạn',
                status: 'active',
            },

            // 🚗 Thuê xe (6)
            {
                question: 'Tôi cần bằng lái loại nào để thuê xe?',
                answer: 'Bạn cần có bằng lái hợp lệ tại Việt Nam hoặc bằng lái quốc tế.',
                categories: 'Thuê xe',
                status: 'active',
            },
            {
                question: 'Giá thuê xe có bao gồm bảo hiểm không?',
                answer: 'Có, giá đã bao gồm bảo hiểm cơ bản cho người thuê.',
                categories: 'Thuê xe',
                status: 'active',
            },
            {
                question: 'Tôi có thể thuê xe theo giờ không?',
                answer: 'Có, bạn có thể chọn thuê theo giờ hoặc theo ngày.',
                categories: 'Thuê xe',
                status: 'active',
            },
            {
                question: 'Có dịch vụ giao xe tận nơi không?',
                answer: 'Một số đối tác cung cấp dịch vụ giao xe tận nơi miễn phí.',
                categories: 'Thuê xe',
                status: 'active',
            },
            {
                question: 'Nếu xe gặp sự cố thì xử lý thế nào?',
                answer: 'Bạn hãy liên hệ ngay hotline hỗ trợ 24/7 được ghi trong hợp đồng thuê.',
                categories: 'Thuê xe',
                status: 'active',
            },
            {
                question: 'Có cần đặt cọc khi thuê xe không?',
                answer: 'Tùy loại xe, có thể yêu cầu đặt cọc từ 500.000đ đến 2.000.000đ.',
                categories: 'Thuê xe',
                status: 'active',
            },

            // 🏡 Bất động sản nghỉ dưỡng (6)
            {
                question: 'Tôi có thể đầu tư vào dự án bất động sản qua nền tảng không?',
                answer: 'Có, bạn có thể xem các dự án hợp tác đầu tư được niêm yết.',
                categories: 'Bất động sản nghỉ dưỡng',
                status: 'active',
            },
            {
                question: 'Làm sao để kiểm tra pháp lý của bất động sản?',
                answer: 'Chúng tôi cung cấp thông tin pháp lý rõ ràng trong phần chi tiết dự án.',
                categories: 'Bất động sản nghỉ dưỡng',
                status: 'active',
            },
            {
                question: 'Bất động sản có thể cho thuê lại qua nền tảng không?',
                answer: 'Có, bạn có thể đăng ký ủy quyền cho chúng tôi cho thuê giúp bạn.',
                categories: 'Bất động sản nghỉ dưỡng',
                status: 'active',
            },
            {
                question: 'Tôi có thể đến xem trước bất động sản không?',
                answer: 'Có, hãy đặt lịch tham quan trực tiếp trên hệ thống.',
                categories: 'Bất động sản nghỉ dưỡng',
                status: 'active',
            },
            {
                question: 'Có chương trình trả góp khi đầu tư không?',
                answer: 'Một số dự án hỗ trợ trả góp linh hoạt từ 6 đến 24 tháng.',
                categories: 'Bất động sản nghỉ dưỡng',
                status: 'active',
            },
            {
                question: 'Lợi nhuận cho thuê được chia thế nào?',
                answer: 'Lợi nhuận được chia theo tỉ lệ thỏa thuận trong hợp đồng hợp tác.',
                categories: 'Bất động sản nghỉ dưỡng',
                status: 'active',
            },

            // 🎟️ Đặt vé (7)
            {
                question: 'Tôi có thể đặt vé máy bay qua ứng dụng không?',
                answer: 'Có, bạn có thể đặt vé máy bay trong mục “Đặt vé”.',
                categories: 'Đặt vé',
                status: 'active',
            },
            {
                question: 'Tôi có thể đổi tên vé sau khi đặt không?',
                answer: 'Một số hãng cho phép đổi tên vé có tính phí, vui lòng kiểm tra trước khi đặt.',
                categories: 'Đặt vé',
                status: 'active',
            },
            {
                question: 'Tôi có thể hoàn vé nếu không đi được không?',
                answer: 'Tùy loại vé, bạn có thể được hoàn một phần hoặc không hoàn.',
                categories: 'Đặt vé',
                status: 'active',
            },
            {
                question: 'Hệ thống có hỗ trợ chọn chỗ ngồi khi đặt vé không?',
                answer: 'Có, bạn có thể chọn chỗ ngồi yêu thích trong quá trình đặt vé.',
                categories: 'Đặt vé',
                status: 'active',
            },
            {
                question: 'Có giảm giá khi đặt vé khứ hồi không?',
                answer: 'Hệ thống sẽ tự động tính ưu đãi khi bạn chọn vé khứ hồi.',
                categories: 'Đặt vé',
                status: 'active',
            },
            {
                question: 'Tôi có thể đặt vé cho người khác không?',
                answer: 'Có, bạn chỉ cần nhập đúng thông tin người đi.',
                categories: 'Đặt vé',
                status: 'active',
            },
            {
                question: 'Tôi có thể thanh toán vé qua ví điện tử không?',
                answer: 'Có, chúng tôi hỗ trợ Momo, ZaloPay và VNPay.',
                categories: 'Đặt vé',
                status: 'active',
            },
        ];

        await faqRepository.insert(faqs.map(f => ({ ...f, created_at: new Date() })));
        console.log('✅ Đã seed 50 FAQ mẫu thành công!');
    }
}
