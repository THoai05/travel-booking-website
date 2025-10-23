import api from "@/axios/axios"
import { useQuery } from "@tanstack/react-query"

export const useHandleHotels = (
    page: number = 1,
    limit: number,
    minPrice?: number,
    maxPrice?: number,
    star?: number,
    amenities?:string[],
    cityTitle:string,
    hotelName:string
) => {
    return useQuery({
        queryKey: ['hotels',
            page,
            limit,
            minPrice,
            maxPrice,
            star,
            amenities,
            cityTitle,
            hotelName
        ],
        queryFn: async () => {
            console.log(page,limit,minPrice,maxPrice,star,amenities)
            const response = await api.get('hotels', {
                params: {
                    page,
                    limit,
                    minPrice,
                    maxPrice,
                    star,
                    amenities,
                    cityTitle,
                    hotelName
                }
            })
            return response.data
        },
        staleTime: 1000 * 60 * 10
        
   })
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
        staleTime:1000 * 60 * 10
    })
}

   

