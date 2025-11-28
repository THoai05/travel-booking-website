"use client";

import { PropertyDetail } from '../types';
import { Star, MapPin, Share2, Heart, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAppDispatch, useAppSelector } from '@/reduxTK/hook';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useMemo, useState } from 'react';
import { addFavouriteThunk, deleteFavouriteThunk, fetchFavourites } from '@/reduxTK/features/favourite/favouriteThunk';
import dynamic from 'next/dynamic';

// --- 1. Import Map Component (Tắt SSR) ---
const HotelMap = dynamic(() => import('../components/HotelMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Đang tải bản đồ...</div>
});

interface PropertyHeaderProps {
  property: PropertyDetail;
  hotel:any
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  console.log("property:",property)
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();
  const favourites = useAppSelector(state => state.favourites.favourites);
  const [loadingFav, setLoadingFav] = useState(false);

  // --- 2. State quản lý đóng mở Modal Map ---
  const [isMapOpen, setIsMapOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchFavourites(currentUser.id));
    }
  }, [currentUser, dispatch]);

  const favForThisHotel = useMemo(() => {
    if (!property) return null;
    return favourites.find(f => f.hotel?.id === property.id);
  }, [favourites, property]);

  const isFav = Boolean(favForThisHotel);

  const handleToggleFav = async () => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập để lưu yêu thích");
      return;
    }

    if (loadingFav) return;
    setLoadingFav(true);

    try {
      if (favForThisHotel) {
        await dispatch(deleteFavouriteThunk(favForThisHotel.id));
      } else {
        await dispatch(addFavouriteThunk({ userId: currentUser.id, hotelId: property.id }));
      }
      await dispatch(fetchFavourites(currentUser.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFav(false);
    }
  };

  return (
    <>
      <div className="py-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                {property?.name || "Bluevera"}
              </h1>
              <Badge className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sm">
                {"Khách sạn " + Math.floor(property?.summaryReview?.avgRating || 0) + " sao"}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-sky-500" />
                <span>{property?.city?.title || "city title"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium text-gray-800">{Number(property?.summaryReview?.avgRating || 0).toFixed(1)}</span>
                <span className="text-gray-500">({property?.summaryReview?.reviewCount || 0} đánh giá)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hover:bg-sky-50 hover:text-sky-600 border-sky-100"
            >
              <Share2 className="w-5 h-5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFav}
              disabled={loadingFav}
              className={`rounded-full border-rose-100 ${isFav
                  ? "bg-rose-50 text-rose-600"
                  : "hover:bg-rose-50 hover:text-rose-600 text-gray-500"
                }`}
            >
              <Heart className={`w-5 h-5 ${isFav ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 font-medium">
              ⭐ {Number(property?.summaryReview?.avgRating || 0).toFixed(1)} / 5.0
            </span>
            <span className="text-gray-500">Dựa trên {property?.summaryReview?.reviewCount || 0} đánh giá</span>
          </div>

          {/* --- 3. Nút kích hoạt Modal --- */}
          <div 
            onClick={() => setIsMapOpen(true)}
            className="text-sky-700 font-semibold cursor-pointer hover:underline flex items-center gap-1 hover:text-sky-800 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Xem vị trí trên bản đồ
          </div>
        </div>
      </div>

      {/* --- 4. Modal Full Screen --- */}
      {isMapOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-8">
          {/* Container trắng chứa Map */}
          <div className="bg-white w-full h-full md:max-w-6xl md:h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white z-10">
              <div>
                <h3 className="font-bold text-lg text-gray-800">Vị trí khách sạn</h3>
                <p className="text-sm text-gray-500">{property?.address}, {property?.city?.title}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsMapOpen(false)}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-500" />
              </Button>
            </div>

            {/* Body chứa Map Component */}
            <div className="flex-1 relative bg-gray-50">
               {/* Truyền vào property dưới dạng mảng 1 phần tử để tái sử dụng component Map cũ */}
               {/* Ép kiểu any nếu PropertyDetail chưa khớp hoàn toàn với interface HotelData bên map, 
                   nhưng logic render vẫn chạy tốt nếu có field name, city.lat/lon */}
               <HotelMap hotels={[property] as any} />
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}