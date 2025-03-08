import classNames from "classnames";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { DailyTask, WeekTask } from "../week-planner.types";
import { DAILY_TASKS_2025_03_10 as DAILY_TASKS, WEEKLY_TASKS_2025_03_10 as WEEKLY_TASKS } from "./generator-form.data";
import "./generator-form.styles.css";

enum StartStatus {
  NOT_SET = "NOT_SET",
  INVALID = "INVALID",
  VALID = "VALID",
}
const MONDAY_INDEX = 0;
type WeekPlannerGeneratorFormProps = { onClose: () => void };
const WeekPlannerGeneratorFormComponent = ({ onClose = () => {} }: WeekPlannerGeneratorFormProps) => {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [startStatus, setStartStatus] = useState<StartStatus>(StartStatus.NOT_SET);
  const [weekStart, setWeekStart] = useState<string>("");
  const [weekTasks, setWeekTasks] = useState<WeekTask[]>([]);

  useEffect(() => {
    setDailyTasks(DAILY_TASKS.map((dt) => ({ ...dt })));
    setWeekTasks(WEEKLY_TASKS.map((wt) => ({ ...wt })));
  }, []);

  useEffect(() => {
    if (weekStart === "") {
      setStartStatus(StartStatus.NOT_SET);
    } else if (new Date(weekStart).getDay() === MONDAY_INDEX) {
      setStartStatus(StartStatus.VALID);
    } else {
      setStartStatus(StartStatus.INVALID);
    }
  }, [weekStart]);

  const handleChangeDailyTaskName = (id: string, name: string) => {
    setDailyTasks((prev) => prev.map((dt: DailyTask) => (dt.id === id ? { ...dt, name } : dt)));
  };

  const handleChangeDailyTaskPoints = (id: string, points: string) => {
    setDailyTasks((prev) => prev.map((dt: DailyTask) => (dt.id === id ? { ...dt, points: Number(points) } : dt)));
  };

  const handleChangeDailyTaskWeeklyMax = (id: string, weeklyMax: string) => {
    setDailyTasks((prev) => prev.map((dt: DailyTask) => (dt.id === id ? { ...dt, weeklyMax: Number(weeklyMax) } : dt)));
  };

  const handleChangeWeek = (e: ChangeEvent<HTMLInputElement>) => {
    setWeekStart(e.target.value);
  };

  const handleChangeWeekTaskName = (id: string, name: string) => {
    setWeekTasks((prev) => prev.map((dt: WeekTask) => (dt.id === id ? { ...dt, name } : dt)));
  };

  const handleChangeWeekTaskPoints = (id: string, points: string) => {
    setWeekTasks((prev) => prev.map((dt: WeekTask) => (dt.id === id ? { ...dt, points: Number(points) } : dt)));
  };

  const handleClickAddDailyTask = () => {
    setDailyTasks((prev) => [...prev, { id: uuidV4(), name: "", points: 2, weeklyMax: 2 }]);
  };

  const handleClickAddWeekTask = () => {
    setWeekTasks((prev) => [...prev, { id: uuidV4(), name: "", points: 2 }]);
  };

  const handleClickDeleteDailyTask = (id: string) => {
    const updatedDailyTasks: DailyTask[] = [];
    dailyTasks.forEach((dt) => {
      if (dt.id !== id) {
        updatedDailyTasks.push({ ...dt });
      }
    });
    setDailyTasks(updatedDailyTasks);
  };

  const handleClickDeleteWeekTask = (id: string) => {
    const updatedWeekTasks: WeekTask[] = [];
    weekTasks.forEach((wt) => {
      if (wt.id !== id) {
        updatedWeekTasks.push({ ...wt });
      }
    });
    setWeekTasks(updatedWeekTasks);
  };

  const handleClickSubmit = () => {
    const hasInvalidDailyTask = dailyTasks.some((dt) => !dt.name || dt.points <= 0); // || (dt.weeklyMax || 0) <= 0);
    const hasInvalidWeekTask = weekTasks.some((wt) => !wt.name || wt.points <= 0);
    if (hasInvalidDailyTask || hasInvalidWeekTask) {
      alert("form tasks are not valid");
      return;
    }
    if (startStatus !== StartStatus.VALID) {
      alert("need a valid start date");
      return;
    }

    const link = document.createElement("a");
    const jsonStr = JSON.stringify({
      dailyTasks: dailyTasks.map((dt) => ({ ...dt, daysComplete: [false, false, false, false, false, false, false] })),
      weekTasks: weekTasks.map((wt) => ({ ...wt, complete: false })),
      weekStart,
    });
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `weekly-planner-form-${new Date().toISOString()}.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <section>
      <div className="form-buttons-container">
        <button onClick={handleClickSubmit}>Submit</button>
        <button className="form-back-button" onClick={onClose}>
          Back
        </button>
      </div>
      <div>
        <label htmlFor="date">week start date</label>
        <input
          className={classNames("form-start-date-input", startStatus === StartStatus.INVALID && "invalid-form-input")}
          name="date"
          onChange={handleChangeWeek}
          type="date"
          value={weekStart}
        />
      </div>
      <h4>
        daily tasks
        <span className="form-daily-tasks-count"> ({dailyTasks.length})</span>
      </h4>
      <div>
        <div>
          <span className="form-daily-task-header">name</span>
          <span className="form-daily-task-header">points</span>
          <span className="form-daily-task-header">weekly max</span>
        </div>
        {dailyTasks.map((task) => {
          return (
            <div key={task.id}>
              <button onClick={() => handleClickDeleteDailyTask(task.id)}>DEL</button>
              <input
                className={classNames(!task.name && "invalid-form-input")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDailyTaskName(task.id, e.target.value)}
                type="text"
                value={task.name}
              />
              <input
                className={classNames((!task.points || task.points < 0) && "invalid-form-input")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDailyTaskPoints(task.id, e.target.value)}
                type="number"
                value={task.points}
              />
              <input
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDailyTaskWeeklyMax(task.id, e.target.value)}
                type="number"
                value={task.weeklyMax}
              />
            </div>
          );
        })}
      </div>
      <button onClick={() => handleClickAddDailyTask()}>Add Daily Task</button>
      <h4>
        week tasks
        <span className="form-weekly-tasks-count"> ({weekTasks.length})</span>
      </h4>
      <div>
        <div>
          <span className="form-daily-task-header">name</span>
          <span className="form-daily-task-header">points</span>
        </div>
        {weekTasks.map((task) => {
          return (
            <div key={task.id}>
              <button onClick={() => handleClickDeleteWeekTask(task.id)}>DEL</button>
              <input
                className={classNames(!task.name && "invalid-form-input", "weekly-task-name")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeWeekTaskName(task.id, e.target.value)}
                type="text"
                value={task.name}
              />
              <input
                className={classNames((!task.points || task.points < 0) && "invalid-form-input")}
                min="1"
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeWeekTaskPoints(task.id, e.target.value)}
                type="number"
                value={task.points}
              />
            </div>
          );
        })}
      </div>
      <button onClick={() => handleClickAddWeekTask()}>Add Week Task</button>
    </section>
  );
};

export default WeekPlannerGeneratorFormComponent;
