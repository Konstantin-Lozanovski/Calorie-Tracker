import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import { useMemo } from "react";
import {fetchDay, searchFoods, addEntry} from "../services/api.js";
import "../css/Day.css";

const Day = ({user}) => {
  const {date} = useParams(); // date is the string from URL
  const [dayLog, setDayLog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeMealId, setActiveMealId] = useState(null); // which meal’s panel is open
  const [tab, setTab] = useState("search"); // "search" | "myFoods"
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();


  const totals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    if (!dayLog.meals) return { calories, protein, carbs, fat };

    dayLog.meals.forEach(meal => {
      meal.entries.forEach(entry => {
        const factor = entry.quantity / 100;
        calories += entry.food.calories * factor;
        protein += entry.food.protein * factor;
        carbs += entry.food.carbs * factor;
        fat += entry.food.fat * factor;
      });
    });

    return {
      calories: calories.toFixed(0),
      protein: protein.toFixed(1),
      carbs: carbs.toFixed(1),
      fat: fat.toFixed(1)
    };
  }, [dayLog]);



  useEffect(() => {
    const getDay = async () => {
      try {
        setLoading(true);
        const data = await fetchDay(date);
        setDayLog(data);
      } catch (error) {
        setError(error.msg || "Failed to fetch daily log");
      } finally {
        setLoading(false);
      }
    }

    getDay()
  }, [date, user.id])

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const results = await searchFoods(searchQuery);
        setSearchResults(results);
      } catch (error) {
        setError(error.msg || "Failed to fetch daily log");
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce); // cleanup
  }, [searchQuery]);

  const handleViewFood = (meal, food) => {
    navigate(`/day/${date}/meal/${meal.id}/food/${food.id}`);
  }

  const handleAddFood = async (mealId, foodId) => {
    try {
      await addEntry(mealId, foodId, 100);

      // 1. Refresh day log
      const updatedDay = await fetchDay(date);
      setDayLog(updatedDay);

      // 2. Close the add-food panel
      setActiveMealId(null);

      // 3. Optionally reset search
      setSearchQuery("");
      setSearchResults([]);
      setTab("search");
    } catch (error) {
      setError(error.msg || "Failed to add food");
    }
  };


  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  console.log(dayLog);

  return (
    <div>
      <h1>Daily Log: {dayLog.date}</h1>
      <h3>Totals</h3>
      <p>Calories: {totals.calories} kcal</p>
      <p>Protein: {totals.protein} g</p>
      <p>Carbs: {totals.carbs} g</p>
      <p>Fat: {totals.fat} g</p>
      {dayLog.meals.map(meal => (
        <div key={meal.id} className="meal">
          <h2>{meal.name}</h2>

          {meal.entries.length ? (
            <ul>
              {meal.entries.map(entry => (
                <li key={entry.id}>
                  {entry.quantity} {entry.food.serving_unit}s {entry.food.name} - {(entry.quantity * entry.food.calories / 100).toFixed(1)} cal
                </li>
              ))}
            </ul>
          ) : <p>No entries yet</p>}

          <button onClick={() => setActiveMealId(activeMealId === meal.id ? null : meal.id)}>
            Add Food
          </button>

          {activeMealId === meal.id && (
            <div className="add-food-panel">
              {/* Tabs */}
              <div className="tabs">
                <button onClick={() => setTab("search")} className={tab === "search" ? "active" : ""}>Search</button>
                <button onClick={() => setTab("myFoods")} className={tab === "myFoods" ? "active" : ""}>MyFoods</button>
              </div>

              {/* Tab content */}
              {tab === "search" && (
                <div className="search-tab">
                  <input
                    type="text"
                    placeholder="Search foods..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <ul>
                    {searchResults.map(food => (
                      <li key={food.id}>
                        {food.name} - {food.calories} cal
                        <button onClick={() => handleAddFood(meal.id, food.id)}>Add</button>
                        <button onClick={() => handleViewFood(meal, food)}>View</button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tab === "myFoods" && (
                <div>
                  {/* Render user’s saved foods here */}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

    </div>
  )

};

export default Day;
