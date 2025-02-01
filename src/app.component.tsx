import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import WeeklyPlannerComponent from "./sections/week-planner/week-planner.component";

const AppComponent = () => {
  return (
    <Routes>
      <Route path="/week-planner" element={<WeeklyPlannerComponent />} />
      <Route path="/schedule-tracker" element={<Fragment />} />
      <Route path="*" element={<Fragment />} />
    </Routes>
  );
};

export default AppComponent;
