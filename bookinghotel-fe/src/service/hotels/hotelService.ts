import api from "@/axios/axios"
import { useQuery } from "@tanstack/react-query"

// Thay thế 'useQuery' bằng 'useInfiniteQuery'
import { useInfiniteQuery } from '@tanstack/react-query';


// GetAllHotelRequest từ backend của bro
interface GetAllHotelRequest {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  star?: number;
  amenities?: string[];
  cityTitle?: string;
  hotelName?: string;
}

// Kiểu trả về từ API của bro
interface HotelApiResponse {
  data: any[]; // Hoặc BackendHotel[]
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useHandleHotels = (
  limit: number,
  minPrice?: number,
  maxPrice?: number,
  star?: number,
  amenities?: string[],
  cityTitle?: string,
  hotelName?: string
) => {
  return useInfiniteQuery<HotelApiResponse, Error>({
    // 1. queryKey KHÔNG CÒN `page`
    // Khi key này thay đổi (do filter), nó sẽ tự động reset về trang 1
    queryKey: ['hotels', limit, minPrice, maxPrice, star, amenities, cityTitle, hotelName],
    
    // 2. queryFn nhận `pageParam`
    queryFn: async ({ pageParam = 1 }) => {
      console.log(`Fetching page: ${pageParam}`); // Log để debug
      const params: GetAllHotelRequest = {
        page: pageParam,
        limit,
        minPrice,
        maxPrice,
        star,
        amenities,
        cityTitle,
        hotelName
      };
      
      const response = await api.get('hotels', { params });
      
      // 3. Phải return toàn bộ data API (để getNextPageParam dùng)
      return response.data; 
    },
    
    // 4. Trang bắt đầu
    initialPageParam: 1,
    
    // 5. Logic quan trọng nhất:
    // Báo cho React Query biết trang tiếp theo là trang nào
    getNextPageParam: (lastPage) => {
      // 'lastPage' chính là object 'response.data' trả về từ queryFn
      
      // Nếu trang hiện tại (lastPage.page) < tổng số trang (lastPage.totalPages)
      if (lastPage.page < lastPage.totalPages) {
        // Trả về số trang TIẾP THEO
        return lastPage.page + 1;
      }
      
      // Nếu đã là trang cuối, return undefined để báo hết
      return undefined;
    },
    
    staleTime: 1000 * 60 * 10 // Giữ nguyên staleTime
  });
}


export const useHandleHotelById = (id:number) => {
    return useQuery({
        queryKey: ['singleHotel', id],
        queryFn: async () => {
            const response = await api.get(`hotels/${id}`)
            return response.data.data
        },
        staleTime: 1000 * 60 * 10
    })
}

export const useHandleSimilarHotelByCityId = (id: number) => {
    return useQuery({
        queryKey: ['singleHotel', id],
        queryFn: async () => {
            const response = await api.get(`hotels/${id}/similar`)
            return response.data
        },
        enabled:!!id,
        staleTime:1000 * 60 * 10
    })
}

export const useHandleGetHotelsByRegionId = (id: number) => {
    return useQuery({
        queryKey: ['regionHotel', id],
        queryFn: async () => {
            const response = await api.get(`regions/${id}/hotels`)
            return response.data
        },
        enabled: !!id,
        staleTime: 1000 * 60 * 10
    })
}

export const useHandleGetRoomTypeAndRatePlan = (id: number) => {
  return useQuery({
    queryKey: ['roomTypeAndRatePlan', id],
    queryFn: async () => {
      const response = await api.get(`hotels/${id}/room-options`)
      return response.data.data
    },
    enabled: !!id,
    staleTime: 0
  })
}

export const useHandleGet6Hotels = () => {
  return useQuery({
    queryKey: ['6hotels'],
    queryFn: async () => {
      const response = await api.get(`hotels/random-hotels`)
      return response.data.data
    },
    staleTime:1000 * 60 * 60
  })
}

   

