'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Filter, X, Star, Wifi, Utensils, Waves, Coffee, Building2, MapPin, Search, ArrowUp } from 'lucide-react';
import Image from 'next/image';
import { useHandleHotels } from '@/service/hotels/hotelService';
import { useRouter } from 'next/navigation';


const HotelCard = ({ hotel , onclick }) => {
    // Logic để hiển thị nhãn "Top Rated" hoặc "Best Sale"
    const getLabel = () => {
        if (hotel.avgRating >= 3.5) return { text: "Top Rated", color: "text-[#3DC262]" };
        // if (hotel.price < 600000) return { text: "Best Sale", color: "text-red-500" };
        return null;
    };
    const label = getLabel();

    return (
        <div  onClick={onclick} className="rounded-3xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl
        transition-shadow duration-300 bg-white group">
            {/* Phần ảnh */}
            <div className="relative w-full h-[250px] rounded-t-3xl overflow-hidden">
                <Image 
                    src="/room1.png"
                    alt={hotel.name} 
                    width={50}
                    height={50}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                />
                {label && (
                    <span className={`absolute top-4 left-4 bg-white ${label.color} px-3 py-1 text-sm rounded-full font-bold shadow-sm`}>
                        {label.text}
                    </span>
                )}
                <button className="absolute top-4 right-4 w-9 h-9 bg-white/80 backdrop-blur-sm
                rounded-full shadow-md flex items-center justify-center text-red-500 hover:scale-110
                transition-transform hover:bg-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                </button>
            </div>

            {/* Phần thông tin */}
            <div className="relative z-10 p-5 -mt-6 bg-white rounded-t-3xl">
                <span className="absolute -top-4 right-5 flex items-center gap-1 text-yellow-500 text-xs bg-white shadow-md rounded-2xl px-4 py-2 font-semibold">
                    ⭐ <span className="text-black">{hotel.avgRating} ({hotel.reviewCount} reviews)</span>
                </span>
                <h3 className="font-bold text-lg mb-1 truncate">{hotel.name}</h3>
                <div className="flex items-center gap-1 text-gray-600 text-sm mb-4">
                    <MapPin size={14} />
                    <span>{hotel.city.title}</span>
                </div>
                <div className="flex items-center justify-between mt-4">
                    {/* <p className="font-bold text-xl">
                        {hotel?.price.toLocaleString()} ₫
                        <span className="text-gray-700 text-sm font-normal">/đêm</span>
                    </p> */}
                    <button className="bg-black text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-800 transition transform hover:scale-105 active:scale-100">
                        Đặt ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component hiển thị khi không có kết quả nào khớp với bộ lọc
const NoResultsFound = ({ onReset }) => (
    <div className="text-center py-20 col-span-full">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Search size={40} className="text-gray-400" />
        </div>
        <p className="text-gray-600 text-lg mb-2">Không tìm thấy khách sạn phù hợp</p>
        <p className="text-gray-500 mb-4">Hãy thử thay đổi hoặc xóa bộ lọc để có kết quả tốt hơn.</p>
        {/* Nút này gọi hàm `onReset` được truyền từ component cha để xóa bộ lọc */}
        <button onClick={onReset} className="text-black font-semibold hover:underline">Xóa bộ lọc</button>
    </div>
);


// --- Main Hotels Component ---

export default function HotelsPage() {
    /*
    // --- CÁC STATE (TRẠNG THÁI) ĐỂ QUẢN LÝ BỘ LỌC ĐÃ ĐƯỢC VÔ HIỆU HÓA ---
    const [searchQuery, setSearchQuery] = useState(''); // State cho ô tìm kiếm theo tên/vị trí
    const [showFilter, setShowFilter] = useState(false); // State để ẩn/hiện thanh filter trên mobile
    const [minPrice, setMinPrice] = useState(0); // State cho giá trị tối thiểu của khoảng giá
    const [maxPrice, setMaxPrice] = useState(2500000); // State cho giá trị tối đa của khoảng giá
    const [selectedStars, setSelectedStars] = useState([]); // State lưu mảng các hạng sao được chọn (vd: [5, 4])
    const [selectedAmenities, setSelectedAmenities] = useState([]); // State lưu mảng các tiện ích được chọn (vd: ["Wifi miễn phí", "Hồ bơi"])
    */

    // Mock data cho khách sạn
    // const hotelsData = useMemo(() => [
    //     { id: 1, name: "Khách sạn Biển Xanh", price: 800000, stars: 4, amenities: ["Wifi miễn phí", "Hồ bơi"], location: "Nha Trang", reviews: 324, image: 'https://placehold.co/600/3498db/ffffff?text=Biển+Xanh' },
    //     { id: 2, name: "Khách sạn Ánh Dương", price: 1200000, stars: 5, amenities: ["Nhà hàng", "Bữa sáng"], location: "Đà Nẵng", reviews: 512, image: 'https://placehold.co/600/e74c3c/ffffff?text=Ánh+Dương' },
    //     { id: 3, name: "Khách sạn Phố Cổ", price: 500000, stars: 3, amenities: ["Wifi miễn phí"], location: "Hà Nội", reviews: 189, image: 'https://placehold.co/600/9b59b6/ffffff?text=Phố+Cổ' },
    //     { id: 4, name: "Khách sạn Núi Xanh", price: 700000, stars: 4, amenities: ["Hồ bơi", "Gần biển"], location: "Quy Nhơn", reviews: 267, image: 'https://placehold.co/600/2ecc71/ffffff?text=Núi+Xanh' },
    //     { id: 5, name: "Khách sạn Thành Phố", price: 600000, stars: 3, amenities: ["Wifi miễn phí", "Nhà hàng"], location: "Hồ Chí Minh", reviews: 145, image: 'https://placehold.co/600/f1c40f/ffffff?text=Thành+Phố' },
    //     { id: 6, name: "Khách sạn Thiên Đường", price: 1500000, stars: 5, amenities: ["Hồ bơi", "Bữa sáng", "Gần biển"], location: "Phú Quốc", reviews: 678, image: 'https://placehold.co/600/1abc9c/ffffff?text=Thiên+Đường' },
    //     { id: 7, name: "Khách sạn Bình Yên", price: 400000, stars: 2, amenities: ["Wifi miễn phí"], location: "Huế", reviews: 98, image: 'https://placehold.co/600/34495e/ffffff?text=Bình+Yên' },
    //     { id: 8, name: "Khách sạn Hoàng Gia", price: 2000000, stars: 5, amenities: ["Nhà hàng", "Bữa sáng", "Hồ bơi"], location: "Sapa", reviews: 890, image: 'https://placehold.co/600/d35400/ffffff?text=Hoàng+Gia' },
    //     { id: 9, name: "Khách sạn Sông Xanh", price: 900000, stars: 4, amenities: ["Gần biển", "Wifi miễn phí"], location: "Vũng Tàu", reviews: 445, image: 'https://placehold.co/600/2980b9/ffffff?text=Sông+Xanh' },
    //     { id: 10, name: "Khách sạn Mặt Trời", price: 1100000, stars: 4, amenities: ["Hồ bơi", "Nhà hàng"], location: "Cần Thơ", reviews: 356, image: 'https://placehold.co/600/f39c12/ffffff?text=Mặt+Trời' },
    // ], []);

   const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  const { data: hotelsResponse } = useHandleHotels(currentPage, limit);
    const hotelsData = hotelsResponse?.data || [];
    console.log(hotelsData)
    console.log(hotelsResponse)
  const total = hotelsResponse?.total || 0;
  const totalPages = hotelsResponse?.totalPages || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // cuộn lên đầu trang khi đổi trang
    }
    };
    
    const router = useRouter()
  


  

    /*
    // Các tùy chọn cho bộ lọc, để dễ dàng quản lý và render (Vẫn giữ lại để sau này dùng)
    const STAR_OPTIONS = [5, 4, 3, 2, 1];
    const AMENITY_OPTIONS = [
        { name: "Wifi miễn phí", icon: <Wifi size={16} /> }, { name: "Hồ bơi", icon: <Waves size={16} /> },
        { name: "Bữa sáng", icon: <Coffee size={16} /> }, { name: "Gần biển", icon: <Building2 size={16} /> },
        { name: "Nhà hàng", icon: <Utensils size={16} /> },
    ];
    */

    /*
    // --- CÁC HÀM XỬ LÝ SỰ KIỆN CHO BỘ LỌC ĐÃ ĐƯỢC VÔ HIỆU HÓA ---
    const toggleStar = (s) => setSelectedStars(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]);
    const toggleAmenity = (a) => setSelectedAmenities(p => p.includes(a) ? p.filter(x => x !== a) : [...p, a]);
    const resetAllFilters = () => {
        setMinPrice(0); setMaxPrice(2500000);
        setSelectedStars([]); setSelectedAmenities([]);
        setSearchQuery('');
    };
    */
    
    // --- LOGIC LỌC KHÁCH SẠN ĐÃ ĐƯỢC VÔ HIỆU HÓA ---
    // Bây giờ, `filteredHotels` sẽ luôn là toàn bộ danh sách khách sạn ban đầu.
    const filteredHotels = hotelsData;

    /*
    // Logic lọc cũ sử dụng useMemo
    const filteredHotels = useMemo(() => {
        return hotelsData.filter(hotel =>
            (hotel.price >= minPrice && hotel.price <= maxPrice) &&
            (selectedStars.length === 0 || selectedStars.includes(hotel.stars)) &&
            (selectedAmenities.length === 0 || selectedAmenities.every(a => hotel.amenities.includes(a))) &&
            (hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) || hotel.location.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [minPrice, maxPrice, selectedStars, selectedAmenities, searchQuery, hotelsData]);
    */

    // Hàm này tạm thời không làm gì cả, vì không còn bộ lọc để xóa
    const resetAllFilters = () => {
        console.log("Không có bộ lọc nào để xóa.");
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans mt-12">
            <div className="flex relative">
                
                {/* --- TOÀN BỘ PHẦN UI CỦA BỘ LỌC ĐÃ ĐƯỢC VÔ HIỆU HÓA --- */}
                {/*
                // Nút filter cho mobile
                <button onClick={() => setShowFilter(!showFilter)} className="fixed bottom-6 right-6 z-50 md:hidden bg-black text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-transform transform active:scale-90">
                    {showFilter ? <X size={24} /> : <Filter size={24} />}
                </button>

                // Thanh filter bên trái
                <aside className={`fixed inset-y-0 left-0 z-40 md:sticky md:top-0 md:h-screen w-80 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform md:translate-x-0 ${ showFilter ? 'translate-x-0' : '-translate-x-full' }`}>
                    <div className="p-6 md:p-8 h-full overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
                            <button onClick={() => setShowFilter(false)} className="md:hidden text-gray-500 hover:text-gray-700"><X size={20} /></button>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">Khoảng giá (VNĐ)</h3>
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-2">
                                        <input type="number" step="50000" value={minPrice} onChange={(e) => setMinPrice(Math.max(0, parseInt(e.target.value) || 0))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Từ" />
                                        <input type="number" step="50000" value={maxPrice} onChange={(e) => setMaxPrice(Math.max(minPrice, parseInt(e.target.value) || 0))} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm" placeholder="Đến" />
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 bg-gray-50 p-2 rounded">
                                        <span>{minPrice.toLocaleString()} ₫</span><span>{maxPrice.toLocaleString()} ₫</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Hạng sao</h3>
                                <div className="space-y-2">
                                    {STAR_OPTIONS.map(s => (
                                        <label key={s} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50">
                                            <div onClick={() => toggleStar(s)} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${selectedStars.includes(s) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                {selectedStars.includes(s) && <span className="text-white text-xs font-bold">✓</span>}
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-400">{[...Array(s)].map((_, i) => <Star key={i} size={14} fill="currentColor" stroke="none" />)}</div>
                                            <span className="text-gray-700 text-sm group-hover:text-gray-900 flex-1">{s} sao</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-3">Tiện ích</h3>
                                <div className="space-y-2">
                                    {AMENITY_OPTIONS.map(({ name, icon }) => (
                                        <label key={name} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50">
                                            <div onClick={() => toggleAmenity(name)} className={`w-5 h-5 rounded border-2 transition-all flex items-center justify-center ${selectedAmenities.includes(name) ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                                {selectedAmenities.includes(name) && <span className="text-white text-xs font-bold">✓</span>}
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900"><span className="text-gray-500">{icon}</span><span className="text-sm">{name}</span></div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4"><button onClick={resetAllFilters} className="w-full py-2.5 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-medium text-sm">Xóa tất cả</button></div>
                        </div>
                    </div>
                </aside>
                */}

                {/* Phần nội dung chính */}
                {/* class `flex-1` sẽ tự động làm cho nội dung chính chiếm toàn bộ không gian còn lại */}
                <main className="flex-1 p-6 md:p-8 pb-20 md:pb-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Tất cả khách sạn</h1>
                            <p className="text-gray-600">Tìm thấy <span className="font-semibold text-gray-900">{filteredHotels?.length}</span> khách sạn.</p>
                        </div>
                        {filteredHotels?.length > 0 ? (
                            // Tăng số cột trên màn hình lớn (xl) để lấp đầy không gian
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {filteredHotels.map((hotel) => (<HotelCard key={hotel.id} hotel={hotel} onclick={()=>router.push(`hotel-detail/${hotel.id}`)} />))}
                            </div>
                        ) : (<NoResultsFound onReset={resetAllFilters} />)}
                        {totalPages > 1 && (
  <div className="flex justify-center mt-12 space-x-2">
    {/* Nút Previous */}
    <button
      onClick={() => handlePageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-4 py-2 rounded-full border transition ${
        currentPage === 1 
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
          : 'bg-[#E6F7FF] text-[#00BFFF] hover:bg-[#BFEFFF]'
      }`}
    >
      <ChevronLeft size={18} />
    </button>

    {/* Các nút số trang */}
    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`px-4 py-2 rounded-full border transition ${
          currentPage === page
            ? 'bg-[#00BFFF] text-white border-[#00BFFF]'
            : 'bg-[#E6F7FF] text-[#00BFFF] hover:bg-[#BFEFFF]'
        }`}
      >
        {page}
      </button>
    ))}

    {/* Nút Next */}
    <button
      onClick={() => handlePageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className={`px-4 py-2 rounded-full border transition ${
        currentPage === totalPages
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-[#E6F7FF] text-[#00BFFF] hover:bg-[#BFEFFF]'
      }`}
    >
      <ChevronRight size={18} />
    </button>
  </div>
)}x
                    </div>
                </main>
            </div>
        </div>
    );
}