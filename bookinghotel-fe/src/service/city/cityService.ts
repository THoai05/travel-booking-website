import api from "@/axios/axios"
import { useQuery } from "@tanstack/react-query"

export const useHandleFilterTitleCity = (title:string) => {
  
        return useQuery({
        queryKey: ['city',title],
        queryFn: async () => {
            const response = await api.get('city/title-only', {
                params: {
                    title
                }
            })
            return response.data.data
            },
        staleTime: 1000 * 60 * 20
    })
}

export const useHandleGetTitleCities = (isDisplayNavbar:boolean)=>{
    return useQuery({
        queryKey: ['title', isDisplayNavbar],
        queryFn: async () => {
            const response = await api.get('city/only-title')
            return response.data
        },
        enabled:isDisplayNavbar,
        staleTime: 1000 * 60 * 20
    })
}