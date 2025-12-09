import {useNavigate} from "react-router-dom";
import "../css/DayCard.css";

const DayCard = ({date, user}) => {
  const navigate = useNavigate();

  const today = new Date();
  const isFuture = date > today;

  const dayName = date.toLocaleDateString("en-US", {weekday: "short"}); // Mon, Tue…
  const dayNumber = date.getDate(); // 1, 2, 3…
  const monthName = date.toLocaleDateString("en-US", {month: "short"}); // Dec, Jan…

  const pad = (num) => num.toString().padStart(2, "0");

  const dateString = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;


  return (
    <div
      className={`day-card ${isFuture ? "disabled" : ""}`}
      onClick={() => !isFuture && navigate(`/day/${dateString}`)}
    >
      <div className="day-card-header">
        <span className="day-name">{dayName} </span>
        <span className="day-date">{dayNumber} {monthName}</span>
      </div>

      {/* Later: calories, macros, goal met */}
    </div>
  );
};

export default DayCard;
