import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {fetchDay, searchFoods} from "../services/api.js";
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  console.log(dayLog);

  return (
    <div>
      <h1>Daily Log: {dayLog.date}</h1>
      {dayLog.meals.map(meal => (
        <div key={meal.id} className="meal">
          <h2>{meal.name}</h2>

          {meal.entries.length ? (
            <ul>
              {meal.entries.map(entry => (
                <li key={entry.id}>
                  {entry.quantity} {entry.food.unit} {entry.food.name} - {(entry.quantity * entry.food.calories / 100).toFixed(1)} cal
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
                        <button onClick={() => handleAddFood(meal.id, food)}>Add</button>
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
