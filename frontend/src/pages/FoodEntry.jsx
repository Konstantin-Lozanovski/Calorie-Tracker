import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {fetchFood, addEntry} from "../services/api.js";

export default function FoodEntry() {
  const { date, mealId, foodId } = useParams();

  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState("100");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch the specific food entry
  useEffect(() => {
    const getFood = async () => {
      try {
        setLoading(true);
        const data = await fetchFood(foodId);
        setFood(data);
      } catch (error) {
        setError(error.msg || "Failed to fetch food");
      } finally {
        setLoading(false);
      }
    };

    getFood();
  }, [date, mealId, foodId]);

  const handleAdd = async () => {
    try{
      const data = await addEntry(mealId, foodId, quantity);
      navigate(`/day/${date}`)
    }catch(error) {
      setError(error.msg || "Failed to add entry");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Food Entry</h1>

      <p><strong>Name:</strong> {food.name}</p>
      <p><strong>Brand:</strong> {food.brand}</p>

      <p><strong>Calories:</strong> {(quantity * food.calories / 100).toFixed(0)}</p>
      <p><strong>Protein:</strong> {(quantity * food.protein / 100).toFixed(0)}</p>
      <p><strong>Carbs:</strong> {(quantity * food.carbs / 100).toFixed(0)}</p>
      <p><strong>Fat:</strong> {(quantity * food.fat / 100).toFixed(1)}</p>


      <label>
        Quantity:
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
      </label>

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
