import { useState, useEffect } from "react";
import DayCard from "../components/DayCard";
import { getDaysInMonth } from "../utils/date";
import "../css/Dashboard.css";

const Dashboard = ({ user }) => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [days, setDays] = useState([]);

  useEffect(() => {
    const daysInMonth = getDaysInMonth(year, month);
    setDays(daysInMonth);
  }, [month, year]);

  const prevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.username}</h1>

      <div className="month-nav">
        <button onClick={prevMonth}>←</button>
        <span>{new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        <button onClick={nextMonth}>→</button>
      </div>

      <div className="days-grid">
        {days.map((day) => (
          <DayCard key={day.toISOString()} date={day} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
