import { useState } from "react";
import WeekPlannerGeneratorFormComponent from "./generator-form/generator-form.component";
import WeekPlannerTableComponent from "./table/table.component";
import WeekPlannerUploadInputComponent from "./upload-input.component";
import { WeeklyPlanner } from "./week-planner.types";

enum ViewingMode {
  CREATE = "CREATE",
  NONE = "NONE",
  TABLE = "TABLE",
}

const DailyPlannerComponent = () => {
  const [weeklyPlanner, setWeeklyPlanner] = useState<WeeklyPlanner>({ dailyTasks: [], weekStart: "", weekTasks: [] });
  const [viewingMode, setViewingMode] = useState(ViewingMode.NONE);

  const handleClose = () => {
    setViewingMode(ViewingMode.NONE);
  };

  const handleUploadPlanner = (planner: WeeklyPlanner) => {
    setWeeklyPlanner(planner);
    setViewingMode(ViewingMode.TABLE);
  };

  const formatWeekSpan = (dateStr: string): string => {
    const weekStart = new Date(dateStr + "T00:00:00Z");
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" };
    const formatDate = (d: Date) => d.toLocaleDateString("en-US", options);
    return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
  };

  return (
    <div className="week-planner-root">
      <header className="week-planner-header">
        {weeklyPlanner.weekStart ? formatWeekSpan(weeklyPlanner.weekStart) : "weekly-planner"}
      </header>
      {viewingMode === ViewingMode.NONE && (
        <section>
          <h3>Next Steps</h3>
          <button onClick={() => setViewingMode(ViewingMode.CREATE)}>Create New Task Week</button>
          <WeekPlannerUploadInputComponent onUpload={handleUploadPlanner} />
        </section>
      )}
      {viewingMode === ViewingMode.CREATE && <WeekPlannerGeneratorFormComponent onClose={handleClose} />}
      {viewingMode === ViewingMode.TABLE && <WeekPlannerTableComponent onClose={handleClose} planner={weeklyPlanner} />}
    </div>
  );
};

export default DailyPlannerComponent;
