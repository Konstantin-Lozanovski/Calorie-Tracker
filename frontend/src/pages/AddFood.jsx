import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { searchFoods, addEntry, fetchDay } from "../services/api";

const AddFood = () => {
  const { date, mealId } = useParams();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await searchFoods(query);
        setResults(data);
      } catch(error){
        setError(error.msg || "Failed to search foods");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleAdd = async (foodId) => {
    try {
      await addEntry(mealId, foodId, 100);
      navigate(`/day/${date}`);
    } catch (error) {
      setError(error.msg || "Failed to add food");
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="container">
      <h1>Add Food</h1>

      <input
        type="text"
        placeholder="Search foods..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <ul>
          {results.map(food => (
            <li key={food.id}>
              {food.name} — {food.calories} cal
              <button onClick={() => handleAdd(food.id)}>Add</button>
            </li>
          ))}
        </ul>
      )}

      {error && <p>{error}</p>}
    </div>
  );
};

export default AddFood;
