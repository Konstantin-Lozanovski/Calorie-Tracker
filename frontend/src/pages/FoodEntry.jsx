import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import {fetchFood, addEntry, fetchEntry, updateEntry} from "../services/api.js";

export default function FoodEntry() {
  const {date, mealId, foodId, entryId} = useParams();
  const isEditing = Boolean(entryId);
  const isAddingFromSearch = Boolean(foodId && !entryId);

  const [food, setFood] = useState(null);
  const [entry, setEntry] = useState(null);
  const [quantity, setQuantity] = useState("100");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const navigate = useNavigate();

  // Fetch the specific food entry
  useEffect(() => {

    const load = async () => {
      try{
        setLoading(true);
        if(isEditing) {
          const entryData = await fetchEntry(entryId);
          setEntry(entryData);
          setQuantity(entryData.quantity.toString());
          const foodData = await fetchFood(entryData.food_id)
          setFood(foodData);
        }else if(isAddingFromSearch){
          const foodData = await fetchFood(foodId);
          setFood(foodData);
        }
      }catch (error) {
        setError(error.msg || "Failed to fetch entry");
      } finally {
        setLoading(false);
      }
    }

   load()
  }, [date, mealId, foodId, entryId, isEditing, isAddingFromSearch]);

  const handleAdd = async () => {
    try {
      if(isEditing){
        const data = await updateEntry(entry.id, Number(quantity))
      }else if(isAddingFromSearch){
        const data = await addEntry(mealId, foodId, Number(quantity));
      }
      navigate(`/day/${date}`)
    } catch (error) {
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

      <button onClick={handleAdd} disabled={loading}>{isEditing ? "Update" : "Add"}</button>


    </div>
  );
}
