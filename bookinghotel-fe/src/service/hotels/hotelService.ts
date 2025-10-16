import api from "@/axios/axios"
import { useQuery } from "@tanstack/react-query"

export const useHandleHotels = (
    page?: number = 1,
    limit?:number = 8
) => {
    return useQuery({
        queryKey: ['hotels',
            page,
            limit
        ],
        queryFn: async () => {
            const response = await api.get('hotels', {
                params: {
                    page,
                    limit
                }
            })
            return response.data.data
        },
        staleTime: 1000 * 60 * 10
        
   })
}

   

