import Image from 'next/image';
import React from 'react';

const SearchBox = () => {
  return (
    <div className="w-full">
      <div className="bg-white p-6 rounded-xl shadow-2xl max-w-[522px] h-[401px]">
        <div className="flex space-x-4 text-base font-medium py-4">
          <button className="px-4 py-2 text-[14px] text-white bg-black rounded-4xl
          transition duration-200">
            Tours
          </button>
          <button className="px-4 text-[14px] py-1.5 text-gray-700 hover:text-black transition duration-200">
            Khách sạn
          </button>
          <button className="px-4 text-[14px] py-1.5 text-gray-700 hover:text-black transition duration-200">
            Vé
          </button>
          <button className="px-4 text-[14px] py-1.5 text-gray-700 hover:text-black hidden sm:block transition duration-200">
            Thuê xe
          </button>
          <button className="px-4 text-[14px] py-1.5 text-gray-700 hover:text-black hidden sm:block transition duration-200">
            Hoạt động
          </button>
        </div>

        {/* 2. Form Inputs - Khung bao bọc màu xám */}
        <div className="bg-gray-100 p-4 rounded-xl space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Địa điểm */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-500">Địa điểm</label>
              <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
                <span className="flex items-center">
                  <div className="w-4 h-4 mr-1 text-gray-500 flex items-center justify-center">
                    <Image src="/location.png" alt="logo" width={13} height={12} />
                  </div>
                  Đà Nẵng, Việt Nam
                </span>

                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Nhận phòng */}
            <div className="space-y-1 border-l border-gray-300 pl-3">
              <label className="block text-xs font-medium text-gray-500">Nhận phòng</label>
              <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
                <span className="flex items-center">
                  <div className="w-4 h-4 mr-1 text-gray-500 flex items-center justify-center">
                    <Image src="/calendar.png" alt="logo" width={15} height={12} />
                  </div>
                  02/01/2024
                </span>
                {/* Icon mũi tên xuống */}
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Hàng 2: Check Out & Khách */}
          <div className="grid grid-cols-2 gap-3">
            {/* Check Out (Trả phòng) */}
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-500">Check Out</label>
              <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
                <span className="flex items-center">
                  <div className="w-4 h-4 mr-1 text-gray-500 flex items-center justify-center">
                    <Image src="/calendar.png" alt="logo" width={15} height={12} />
                  </div>
                  05/01/2024
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            {/* Khách */}
            <div className="space-y-1 border-l border-gray-300 pl-3">
              <label className="block text-xs font-medium text-gray-500">Khách</label>
              <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
                <span className="flex items-center">
                  <div className="w-4 h-4 mr-1 text-gray-500 flex items-center justify-center">
                    <Image src="/user.png" alt="logo" width={14} height={12} />
                  </div>
                  2 người lớn, 2 trẻ em
                </span>
                {/* Icon mũi tên xuống */}
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Nút Tìm kiếm và Hỗ trợ */}
        <div className="flex items-center justify-between pt-6">

          {/* [NÚT TÌM KIẾM] - Component Button sẽ được đặt tại đây */}
          <div className="flex items-center justify-center bg-black text-white px-8 py-3 rounded-xl font-bold transition duration-150 shadow-lg hover:opacity-90">
            {/* Vui lòng thay thế div này bằng component Button của bạn */}
            Tìm kiếm
          </div>

          {/* Cần hỗ trợ */}
          <div className="flex gap-1">
            <Image src="/user.png" alt="logo" width={15} height={14} />
            <a href="#" className="text-sm text-gray-500 hover:text-black flex items-center">
              Cần hỗ trợ?
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SearchBox;