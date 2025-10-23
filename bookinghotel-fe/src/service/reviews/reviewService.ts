import api from "@/axios/axios"
import { useQuery } from "@tanstack/react-query"

export const useHandleGetReviewsByHotelId = (hotelId:number) => {
    return useQuery({
        queryKey: ['singleReviewHotel', hotelId],
        queryFn: async () => {
            console.log(hotelId)
            const response = await api.get(`reviews/hotel/${hotelId}`)
            return response.data.data
        },
        enabled: !!hotelId,
        staleTime:1000 * 60 * 10
    })
}