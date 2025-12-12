import {useParams} from "react-router-dom";
import {useNavigate} from "react-router-dom";
import {useState, useEffect} from "react";
import {useMemo} from "react";
import {fetchDay, searchFoods, addEntry} from "../services/api.js";
import MacroProgress from "../components/MacroProgress";
import "../css/Day.css";

const Day = ({user}) => {
  const {date} = useParams(); // date is the string from URL
  const [dayLog, setDayLog] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const totals = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    if (!dayLog.meals) return {calories, protein, carbs, fat};

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  console.log(dayLog);

  return (
    <div className="container">
      <div className="day-header">
        <div className="day-title">
          <h1>Daily Log</h1>
          <span className="day-date">{dayLog.date}</span>
        </div>

        <div className="totals-card">
          <div className="total-row">
            <span className="total-label">Calories</span>
            <span className="total-value">{totals.calories} / {user.calorie_goal}</span>
          </div>

          <div className="macros-row">
            <MacroProgress
              label="Protein"
              current={totals.protein}
              goal={user.protein_goal_pct}
              color="#8e44ad"
            />
            <MacroProgress
              label="Carbs"
              current={totals.carbs}
              goal={user.carbs_goal_pct}
              color="#e67e22"
            />
            <MacroProgress
              label="Fat"
              current={totals.fat}
              goal={user.fat_goal_pct}
              color="#27ae60"
            />
          </div>
        </div>
      </div>
      <div className="meals-container">

        {dayLog.meals.map(meal => {
          const mealTotal = meal.entries.reduce((sum, entry) => {
            return sum + (entry.quantity * entry.food.calories) / 100;
          }, 0);

          return (
            <div key={meal.id} className="meal">
              <div className="meal-header">
                <h2>{meal.name} </h2>
                <span className="entry-calories">{mealTotal.toFixed(0)} cal</span>
              </div>

              {meal.entries.length ? (

                <div className="entries">
                  {meal.entries.map(entry => (
                    <div key={entry.id} className="entry-row" onClick={() => navigate(`/day/${date}/meal/${meal.id}/entry/${entry.id}`)}>
                      <span className="entry-name">{entry.food.name}</span>
                      <span
                        className="entry-details">{entry.food.brand} — {entry.quantity}{entry.food.serving_unit}</span>
                      <span className="entry-calories">
                      {(entry.quantity * entry.food.calories / 100).toFixed(1)} cal
                    </span>
                    </div>

                  ))}
                </div>


              ) : <p>No entries yet</p>}

              <button onClick={() => navigate(`/day/${date}/meal/${meal.id}/add`)}>
                Add Food
              </button>
            </div>
          )
        })}

      </div>
    </div>
  )

};

export default Day;
