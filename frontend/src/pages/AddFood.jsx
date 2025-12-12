import {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {searchFoods, addEntry} from "../services/api";
import "../css/AddFood.css";

const AddFood = () => {
  const {date, mealId} = useParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchFoods(query);
        setResults(data);
      } catch (err) {
        setError(err.msg || "Failed to search foods");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleAdd = async (foodId) => {
    try {
      await addEntry(mealId, foodId, 100); // 100g by default
      navigate(`/day/${date}`);
    } catch (err) {
      setError(err.msg || "Failed to add food");
    }
  };

  const handleView = (foodId) => {
    navigate(`/day/${date}/meal/${mealId}/food/${foodId}`);
  }

  return (
    <div className="add-food-container">
      <h1>Add Food</h1>

      <input
        type="text"
        placeholder="Search foods..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      <div className="food-results">
        {results.map(food => (
          <div
            key={food.id}
            className="food-card"
            onClick={() => handleView(food.id)}
          >
            <div className="food-info">
              <span className="food-name">{food.name}</span>
              {food.brand && <span className="food-brand"> — {food.brand}</span>}
              <div className="food-calories">{food.calories} cal / 100g</div>
            </div>
            <button onClick={() => handleAdd(food.id)}>Add</button>
          </div>
        ))}
      </div>

      {error && <p>{error}</p>}
    </div>
  );
};

export default AddFood;
