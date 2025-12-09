import { useParams } from "react-router-dom";
import {useState, useEffect} from "react";
import { fetchDay} from "../services/api.js";

const Day = ({ user }) => {
    const { date } = useParams(); // date is the string from URL
    const [dayLog, setDayLog] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getDay = async () => {
            try {
                setLoading(true);
                const data = await fetchDay(date);
                setDayLog(data);
            }catch(error){
                setError(error.msg || "Failed to fetch daily log");
            }finally {
                setLoading(false);
            }
        }

        getDay()
    },[date, user.id])

    if(loading) return <div>Loading...</div>;
    if(error) return <div>{error}</div>;

    console.log(dayLog);

    return (
        <div>
            <h1>Daily Log: {dayLog.date}</h1>
            {dayLog.meals.map(meal => (
                <div key={meal.id}>
                    <h2>{meal.name}</h2>
                    {meal.entries.length ? (
                        <ul>
                            {meal.entries.map(entry => (
                                <li key={entry.id}>
                                    {entry.quantity} {entry.food.unit} {entry.food.name} - {entry.food.calories} cal
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No entries yet</p>
                    )}
                </div>
            ))}
        </div>
    )

};

export default Day;
