import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {fetchFood, addEntry, fetchEntry, updateEntry, fetchMeal} from "../services/api.js";
import "../css/FoodEntry.css";

export default function FoodEntry() {
  const {date, mealId, foodId, entryId} = useParams();
  const isEditing = Boolean(entryId);
  const isAddingFromSearch = Boolean(foodId && !entryId);

  const [food, setFood] = useState(null);
  const [meal, setMeal] = useState(null);
  const [entry, setEntry] = useState(null);
  const [quantity, setQuantity] = useState("100");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try{
        setLoading(true);

        // fetch meal for display
        const mealData = await fetchMeal(mealId);
        setMeal(mealData);

        if(isEditing) {
          const entryData = await fetchEntry(entryId);
          setEntry(entryData);
          setQuantity(entryData.quantity.toString());
          const foodData = await fetchFood(entryData.food_id)
          setFood(foodData);
        } else if(isAddingFromSearch){
          const foodData = await fetchFood(foodId);
          setFood(foodData);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    load()
  }, [date, mealId, foodId, entryId, isEditing, isAddingFromSearch]);

  const handleAdd = async () => {
    try {
      if(isEditing){
        await updateEntry(entry.id, Number(quantity));
      } else if(isAddingFromSearch){
        await addEntry(mealId, foodId, Number(quantity));
      }
      navigate(`/day/${date}`);
    } catch (error) {
      setError(error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="food-entry-container">
      <h1>{isEditing ? "Edit Entry" : "Add Food"}</h1>

      <div className="food-card2">
        <div className="food-info">
          <h2>{food.name}</h2>
          {food.brand && <p className="food-brand">{food.brand}</p>}
        </div>
        <div className="food-info">
          {meal && <p className="meal-name">Meal: {meal.meal}</p>}
        </div>

        <div className="quantity-input">
          <label>
            Servings:
            <input
              type="number"
              min="0"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </label>
        </div>


        <div className="macros-row">
          <div className="macro-box">
            <span className="macro-label">Calories</span>
            <span className="macro-value">{(quantity * food.calories / 100).toFixed(0)}</span>
          </div>
          <div className="macro-box">
            <span className="macro-label">Protein</span>
            <span className="macro-value">{(quantity * food.protein / 100).toFixed(1)}</span>
          </div>
          <div className="macro-box">
            <span className="macro-label">Carbs</span>
            <span className="macro-value">{(quantity * food.carbs / 100).toFixed(1)}</span>
          </div>
          <div className="macro-box">
            <span className="macro-label">Fat</span>
            <span className="macro-value">{(quantity * food.fat / 100).toFixed(1)}</span>
          </div>
        </div>


        <button onClick={handleAdd}>{isEditing ? "Update" : "Add"}</button>
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
}
