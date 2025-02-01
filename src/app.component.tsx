import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import WeekPlannerComponent from "./sections/week-planner/week-planner.component";
import LandingComponent from "./sections/landing/landing.component";

const AppComponent = () => {
  return (
    <Routes>
      <Route path="/week-planner" element={<WeekPlannerComponent />} />
      <Route path="/schedule-tracker" element={<Fragment />} />
      <Route path="*" element={<LandingComponent />} />
    </Routes>
  );
};

export default AppComponent;
