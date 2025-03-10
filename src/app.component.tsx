import { Route, Routes } from "react-router-dom";
import LandingComponent from "./sections/landing/landing.component";
import ScheduleTrackerComponent from "./sections/schedule-tracker/schedule-tracker.component";
import WeekPlannerComponent from "./sections/week-planner/week-planner.component";
import RedirectComponent from "./redirect.component";

const AppComponent = () => {
  return (
    <Routes>
      <Route path="/week-planner" element={<WeekPlannerComponent />} />
      <Route path="/schedule-tracker" element={<ScheduleTrackerComponent />} />
      <Route path="/home" element={<LandingComponent />} />
      <Route path="*" element={<RedirectComponent />} />
    </Routes>
  );
};

export default AppComponent;
