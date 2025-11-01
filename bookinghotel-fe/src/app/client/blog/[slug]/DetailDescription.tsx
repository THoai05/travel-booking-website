import React from "react";

const DetailDescription = () => {
  return (
    <section className="px-8 py-6 max-w-5xl mx-auto">
      <div className="mb-3 text-sm text-gray-500">
        Vietnam / <span className="text-gray-800">Ho Chi Minh City</span>
      </div>

      <h1 className="text-3xl font-bold mb-4">Thành Phố Hồ Chí Minh</h1>

      <p className="text-gray-600 leading-relaxed">
        Thành phố Hồ Chí Minh (thường được gọi là Sài Gòn) là một thành phố ở
        miền Nam Việt Nam nổi tiếng với vai trò nòng cốt trong chiến tranh Việt
        Nam. Sài Gòn cũng được biết đến với địa danh của thực dân Pháp, trong đó
        có Nhà thờ Đức Bà được xây dựng hoàn toàn bằng nguyên liệu nhập khẩu từ
        Pháp và Bưu điện trung tâm được xây dựng vào thế kỷ 19. Quán ăn nằm dọc
        các đường phố Sài Gòn, nhất là xung quanh …
      </p>

      <a
        href="#"
        className="text-blue-600 hover:underline font-medium mt-3 inline-block"
      >
        Đọc thêm &gt;&gt;
      </a>
    </section>
  );
};

export default DetailDescription;
