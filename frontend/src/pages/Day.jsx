import { useParams } from "react-router-dom";

const Day = ({ user }) => {
    const { date } = useParams(); // date is the string from URL

    return (
        <div>
            <h1>Logs for {date}</h1>
            {/* fetch the daily log using /api/days/:date */}
        </div>
    );
};

export default Day;
