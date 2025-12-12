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

export const addEntry = async (mealId, foodId, quantity) => {
  try{
    const response = await axiosInstance.post(`/api/meals/${mealId}/entries`, {foodId, quantity});
    console.log("Added entries to meals")
    return response.data
  }catch(error){
    throw error.response?.msg || error.message || "Failed adding entry"
  }
}

export const fetchEntry = async (entryId) => {
  try{
    const response = await axiosInstance.get(`/api/meals/entries/${entryId}`);
    return response.data
  }catch(error){
    throw error.response?.msg || error.message || "Failed fetching entry"
  }
}

export const updateEntry = async (entryId, quantity) => {
  try{
    const response = await axiosInstance.put(`/api/meals/entries/${entryId}`, {quantity});
    return response.data
  }catch(error){
    throw error.response?.msg || error.message || "Failed updating entry"
  }
}

export const fetchMeal = async (mealId) => {
  try{
    const response = await axiosInstance.get(`/api/meals/${mealId}`);
    return response.data
  }catch(error){
    throw error.response?.msg || error.message || "Failed fetching meal"
  }
}

export const deleteEntry = async (entryId) => {
  try{
    const response = await axiosInstance.delete(`/api/meals/entries/${entryId}`);
    return response.data
  }catch (error) {
    throw error.response?.msg || error.message || "Failed deleting entry"
  }
}

export const updateUserGoals = async (goals) => {
  try{
    const response = await axiosInstance.put(`/api/user/goals`, goals);
    return response.data
  }catch (error) {
    throw error.response?.msg || error.message || "Failed updating goals"
  }
}
