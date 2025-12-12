import {useState} from "react";
import {updateUserGoals} from "../services/api.js";
import {useNavigate} from "react-router-dom";
import "../css/Profile.css";

export default function Profile({user, setUser}) {
  const [form, setForm] = useState({
    calorieGoal: user.calorie_goal,
    proteinGoalPct: user.protein_goal_pct,
    carbsGoalPct: user.carbs_goal_pct,
    fatGoalPct: user.fat_goal_pct,
    weightGoal: user.weight_goal || ""
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const proteinGrams = Math.round((form.calorieGoal * (form.proteinGoalPct / 100)) / 4);
  const carbsGrams = Math.round((form.calorieGoal * (form.carbsGoalPct / 100)) / 4);
  const fatGrams = Math.round((form.calorieGoal * (form.fatGoalPct / 100)) / 9);


  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalPct =
      Number(form.proteinGoalPct) +
      Number(form.carbsGoalPct) +
      Number(form.fatGoalPct);

    if (totalPct !== 100) {
      setError({msg: "Protein, carbs, and fat percentages must add up to 100%"});
      return;
    }

    try {
      const data = await updateUserGoals(form)
      setUser(data)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false);
        navigate("/");
      }, 2500);
    } catch (error) {
      setError(error)
      setSuccess(false)
    }

  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile Settings</h1>

      <div className="profile-card">
        <form onSubmit={handleSubmit} className="profile-form">

          <div className="input-group">
            <label>Daily Calorie Goal</label>
            <input
              type="number"
              name="calorieGoal"
              value={form.calorieGoal}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Weight Goal (kgs)</label>
            <input
              type="number"
              name="weightGoal"
              value={form.weightGoal}
              onChange={handleChange}
            />
          </div>

          <div className="macro-section">
            <h2 className="macro-title">Macro Split (%)</h2>

            <div className="input-group">
              <label>Protein %</label>
              <input
                type="number"
                name="proteinGoalPct"
                value={form.proteinGoalPct}
                onChange={handleChange}
              />
              <span className="macro-grams">{proteinGrams}g</span>
            </div>

            <div className="input-group">
              <label>Carbs %</label>
              <input
                type="number"
                name="carbsGoalPct"
                value={form.carbsGoalPct}
                onChange={handleChange}
              />
              <span className="macro-grams">{carbsGrams}g</span>
            </div>

            <div className="input-group">
              <label>Fat %</label>
              <input
                type="number"
                name="fatGoalPct"
                value={form.fatGoalPct}
                onChange={handleChange}
              />
              <span className="macro-grams">{fatGrams}g</span>
            </div>
          </div>

          <button className="save-btn" type="submit">Save Changes</button>
          {/* Success message */}
          {success && <p className="success-msg">Goals updated successfully!</p>}
          {error && <p className="error-msg">{error.msg}</p>}
        </form>
      </div>
    </div>
  );
}
