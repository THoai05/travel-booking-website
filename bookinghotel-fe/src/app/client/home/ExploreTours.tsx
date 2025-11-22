"use client";

const ExploreTours = () => {
  return (
    // Giữ 'mt-20' (80px) để đẩy section xuống dưới navbar
    // Bro phải chỉnh 'mt-20' cho khớp chiều cao navbar
    <section className="w-full bg-white ">
      
      {/* THAY ĐỔI 1: Thêm 'h-[calc(100vh-5rem)]' và 'bg-black' */}
      {/* 'h-[calc(100vh-5rem)]': Set chiều cao div = 100% màn hình TRỪ ĐI 5rem (80px).
        LƯU Ý: '5rem' (80px) phải KHỚP với 'mt-20' (chiều cao navbar).
        'bg-black': Để làm nền cho phần 'letterbox' (viền đen) nếu có.
      */}
      <div className="w-full h-[calc(100vh-5rem)] bg-white">
        <video
          autoPlay
          muted
          loop
          
          // THAY ĐỔI 2: Đổi 'h-auto' thành 'h-full' và thêm 'object-contain'
          // 'h-full': Lấp đầy chiều cao 100% của 'div' cha (cái div 'calc' ở trên)
          // 'object-contain': Hiển thị TOÀN BỘ video, không cắt xén,
          // tự động thêm viền đen (letterbox) nếu tỷ lệ video không khớp.
          className="w-full h-full object-contain pointer-events-none"
        >
          <source
            src="/video/Video_Booking_Khách_Sạn_Bluevera.mp4"
            type="video/mp4"
          />
          Trình duyệt của bạn không hỗ trợ thẻ video.
        </video>
      </div>
    </section>
  );
};

export default ExploreTours;