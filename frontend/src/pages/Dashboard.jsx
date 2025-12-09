import { useState, useEffect } from "react";
import DayCard from "../components/DayCard";
import { getDaysInMonth } from "../utils/date";
import "../css/Dashboard.css";

const Dashboard = ({ user }) => {
    const [days, setDays] = useState([]);

    useEffect(() => {
        const today = new Date();
        const daysInMonth = getDaysInMonth(today.getFullYear(), today.getMonth());
        setDays(daysInMonth);
    }, []);

    return (
        <div>
            <h1>Welcome, {user.username}</h1>
            <div className="days-grid">
                {days.map((day) => (
                    <DayCard
                        key={day.toISOString()}
                        date={day}
                        user={user}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
