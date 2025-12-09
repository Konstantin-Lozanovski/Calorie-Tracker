import axiosInstance from './axiosInstance';

export const fetchDay = async (date) => {
    try {
        const response = await axiosInstance.get(`/api/days/${date}`)
        return response.data
    } catch (error) {
        throw error.response?.msg || error.message || "Failed fetching employees"
    }
}
