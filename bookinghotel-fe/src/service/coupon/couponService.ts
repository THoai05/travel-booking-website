import api from "@/axios/axios"
import { useQuery } from "@tanstack/react-query"

export const useHandleRandomCouponByTitle = (title:string) => {
    return useQuery({
        queryKey: ['coupon', title],
        queryFn: async () => {
            const response = await api.get('coupons/random', {
                params: {
                    title
                }
            })
            return response.data
        },
        enabled: !!title,
        staleTime: 1000 * 60 * 10 
    })
}