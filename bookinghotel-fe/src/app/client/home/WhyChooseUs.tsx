import Image from 'next/image'
import React from 'react'
import styles from "../home/css/WhyChooseUs.module.css";

const WhyChooseUs = () => {
  return (
    <section className={`${styles.WhyChooseUs} py-20 w-full`}>
      <div className="max-w-[1200px] container mx-auto px-14 grid grid-cols-6 gap-8 items-center">
        {/* Cột trái */}
        <div className="col-span-2 flex justify-center">
          <Image src="/love.png" alt="Travel" width={400} height={400} />
        </div>

        {/* Cột phải */}
        <div className="col-span-4 flex flex-col gap-10">
          <div>
            <h2 className="text-5xl font-bold mb-3">Vì sao bạn sẽ chọn chúng tôi</h2>
            <p className="text-gray-700 text-base">
              Hơn <span className="font-semibold">268k+</span> khách hàng đã tin tưởng và đồng hành cùng chúng <br /> tôi trong mỗi hành trình.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Item 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="bg-white shadow-2xl p-3 rounded-xl w-12 h-12 flex items-center justify-center">
                  <Image
                    alt='An toan'
                    src="/safe.png"
                    width={40}
                    height={40}
                  />
                </div>
              </div>

              {/* Bên phải - Text */}
              <div>
                <h4 className="font-bold text-lg mb-2">Bảo mật tuyệt đối</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Cam kết an toàn thông tin và thanh toán qua hệ thống mã hóa đạt chuẩn quốc tế.
                </p>
                <button className="text-sm font-medium flex items-center gap-1
                hover:text-yellow-500 transition">
                  Đọc thêm →
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-4">
              <div className="bg-white shadow-2xl p-3 rounded-xl w-12 h-12 flex
              items-center justify-center">
                <Image
                  alt='An toan'
                  src="/staff.png"
                  width={50}
                  height={45}
                />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Hỗ trợ tận tâm</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Đội ngũ tư vấn viên sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.
                </p>
                <button className="text-sm font-medium flex items-center gap-1
                hover:text-yellow-500 transition">
                  Đọc thêm →
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-4">
              <div className="bg-white shadow-2xl p-3 rounded-xl w-12 h-12 flex
              items-center justify-center">
                <Image
                  alt='An toan'
                  src="/why-3.png"
                  width={50}
                  height={45}
                />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Chính sách minh bạch</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Mọi chi phí và điều khoản đều rõ ràng – không phụ phí ẩn.
                </p>
                <button className="text-sm font-medium flex items-center gap-1 hover:text-yellow-500 transition">
                  Đọc thêm →
                </button>
              </div>
            </div>

            {/* Item 4 */}
            <div className="flex items-start gap-4">
              <div className="bg-white shadow-2xl p-3 rounded-xl w-12 h-12 flex
              items-center justify-center">
                <Image
                  alt='An toan'
                  src="/why-4.png"
                  width={50}
                  height={45}
                />
              </div>
              <div>
                <h4 className="font-bold text-lg mb-2">Đối tác uy tín</h4>
                <p className="text-gray-700 text-sm mb-3">
                  Liên kết với các hãng hàng không, khách sạn và tour hàng đầu thế giới.
                </p>
                <button className="text-sm font-medium flex items-center gap-1 hover:text-yellow-500 transition">
                  Đọc thêm →
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>

  )
}

export default WhyChooseUs