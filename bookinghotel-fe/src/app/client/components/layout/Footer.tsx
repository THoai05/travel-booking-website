import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-400 py-10 px-6 max-w-7xl mx-auto ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Contact Info */}
        <div>
          <img src="/logo.png" alt="" />
          <div className='flex items-start mt-4'>
            <img src="/location.png" alt="Location" className="inline h-5 mr-2 bg-gray-700" />
            <p>4517 Washington Ave<br />Manchester, Kentucky 39495</p>
          </div>
          <p className="mt-2"> Giờ làm việc: 8:00 - 17:00 (Thứ 2 - Thứ 7)</p>
          <p className="mt-2"> support@bluvera.com</p>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-2xl mb-2 text-black">Dịch vụ</h3>
          <ul className="space-y-1 grid grid-cols-2">
            <div>
              <li>Hướng dẫn viên du lịch</li>
              <li>Đặt tour</li>
              <li>Đặt vé máy bay</li>
            </div>
            <div><li>Thuê xe du lịch</li>
              <li>Thuê khách sạn</li>
              <li>Dịch vụ vận chuyển</li>
            </div>


          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">Đăng ký nhận tin</h3>
          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-grow px-4 py-2 rounded-l-2xl border border-gray-300 focus:outline-none"
            />
            <button className="px-4 py-2 bg-black text-white rounded-r-3xl hover:bg-gray-800">
              Đăng ký ngay
            </button>
          </div>
        </div>

        {/* Social + Support */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-black">Theo dõi chúng tôi</h3>
          <div className="flex space-x-4 mb-4">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>

        <div>
          <div>
            <p className="text-black font-bold">Cần hỗ trợ? Gọi ngay:
            </p>
          </div>
          <strong className='text-orange-400'>1-800-222-8888</strong>
        </div>

        <div >
          <h3 className="text-2xl">Payments</h3>
          <div className='flex space-x-4 mt-2'>
            <img src="/visa.png" alt="Visa" className="h-6" />
            <img src="/mastercard.png" alt="Mastercard" className="h-6" />
            <img src="/stripe.png" alt="Stripe" className="h-6" />
            <img src="/skrill.png" alt="Skrill" className="h-6" />
          </div>

        </div>

      </div>

      {/* Footer Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-sm text-center">
        <p>© 2025 Bluvera Inc. All rights reserved.</p>
        <div className="space-x-4 mt-2">
          <a href="#" className="hover:underline">Terms</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Legal Notice</a>
        </div>
      </div>
    </footer >
  );
}
