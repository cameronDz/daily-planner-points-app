import { useState } from "react";
import WeeklyPlannerTableComponent from "./components/weekly-planner-table.component";
import WeeklyPlannerGeneratorFormComponent from "./components/weekly-planner-generator-form.component";
import UploadDailyTaskWeekInputComponent from "./components/upload-weekly-planner-input.component";
import { WeeklyPlanner } from "./app.types";
import "./app.styles.css";

enum ViewingMode {
  CREATE = "CREATE",
  NONE = "NONE",
  TABLE = "TABLE",
}

const AppComponent = () => {
  const [weeklyPlanner, setWeeklyPlanner] = useState<WeeklyPlanner>({ dailyTasks: [], weekStart: "", weekTasks: [] });
  const [viewingMode, setViewingMode] = useState(ViewingMode.NONE);

  const handleClose = () => {
    setViewingMode(ViewingMode.NONE);
  };

  const handleUploadPlanner = (planner: WeeklyPlanner) => {
    setWeeklyPlanner(planner);
    setViewingMode(ViewingMode.TABLE);
  };

  return (
    <div className="App">
      <header className="App-header">daily planner points</header>
      {viewingMode === ViewingMode.NONE && (
        <section>
          <h3>Next Steps</h3>
          <button onClick={() => setViewingMode(ViewingMode.CREATE)}>Create New Task Week</button>
          <UploadDailyTaskWeekInputComponent onUpload={handleUploadPlanner} />
        </section>
      )}
      {viewingMode === ViewingMode.CREATE && <WeeklyPlannerGeneratorFormComponent onClose={handleClose} />}
      {viewingMode === ViewingMode.TABLE && (
        <WeeklyPlannerTableComponent onClose={handleClose} planner={weeklyPlanner} />
      )}
    </div>
  );
};

export default AppComponent;
