import { Link } from "react-router-dom";

const LandingComponent = () => {
  return (
    <div>
      <Link to="/week-planner">Planner</Link> | <Link to="/schedule-tracker">Tracker</Link>
    </div>
  );
};

export default LandingComponent;
