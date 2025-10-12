"use client";
import Image from "next/image";
import { Calendar, Clock, MessageSquare, Heart, ArrowRight } from "lucide-react";
import Button from "../components/common/Button";

const TravelTips = () => {
  const blogs = [
    {
      id: 1,
      tag: "Văn hoá",
      img: "/blog1.png",
      date: "18 Sep 2024",
      time: "6 phút đọc",
      comments: "38 bình luận",
      title: "10 bí kíp giúp chuyến đi của bạn trọn vẹn và suôn sẻ",
      author: "Minh An",
    },
    {
      id: 2,
      tag: "Du lịch",
      img: "/blog2.png",
      date: "18 Sep 2024",
      time: "6 mins",
      comments: "38 comments",
      title: "Mẹo du lịch tiết kiệm cho người mê xê dịch",
      author: "Huy Nam",
    },
    {
      id: 3,
      tag: "Khám phá",
      img: "/blog3.png",
      date: "18 Sep 2024",
      time: "6 mins",
      comments: "38 comments",
      title: "Khám phá những điểm đến “ẩn mình” tuyệt đẹp trên thế giới",
      author: "Mai Phương",
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="text-start w-full">
            <h2 className="text-5xl font-bold mb-3">Tin tức & Mẹo du lịch</h2>
            <p className="text-gray-500">
              Khám phá hành trình, bí kíp và xu hướng du lịch mới nhất từ
              Bluevera
            </p>
          </div>
          <div className="">
            <Button
              type="button"
              title="Xem thêm"
              icon={ArrowRight}
              variant="bg-black text-white px-6 py-3 hover:bg-gray-800 transition"
            />
          </div>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative w-full h-[250px]">
                <Image
                  src={blog.img}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4 bg-white text-sm font-medium px-3 py-1 rounded-full">
                  {blog.tag}
                </div>
                <button className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm hover:bg-gray-100">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm gap-4 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {blog.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {blog.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare size={14} /> {blog.comments}
                  </span>
                </div>

                <h3 className="text-lg font-semibold mb-4 leading-snug">
                  {blog.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src="/author.png"
                      alt={blog.author}
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium">{blog.author}</span>
                  </div>
                  <button className="text-sm bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition">
                    Keep Reading
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelTips