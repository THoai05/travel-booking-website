import api from "@/axios/axios"

const useHandleCity = () => {
    const getAllDateCities = async () => {
        try {
            const response = await api.get('city')
            return response.data.data
        } catch (error) {
            console.log(error)
        }
    }
    return {
        getAllDateCities
    }
}

export default useHandleCity