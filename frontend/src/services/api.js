import axiosInstance from './axiosInstance';

export const fetchDay = async (date) => {
  try {
    const response = await axiosInstance.get(`/api/days/${date}`)
    return response.data
  } catch (error) {
    throw error.response?.msg || error.message || "Failed fetching employees"
  }
}

export const searchFoods = async (query) => {
  try{
    const response = await axiosInstance.get(`/api/foods?search=${query}`);
    return response.data
  }catch(error){
    throw error.response?.msg || error.message || "Failed fetching foods"
  }
}

export const fetchFood = async (foodId) => {
  try{
    const response = await axiosInstance.get(`/api/foods/${foodId}`);
    return response.data
  }catch(error){
    throw error.response?.msg || error.message || "Failed fetching food"
  }
}
