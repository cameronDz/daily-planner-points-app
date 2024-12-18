import classNames from "classnames";
import { ChangeEvent, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import { DailyTask, WeekTask } from "../app.types";
import { DAILY_TASKS_V3, WEEKLY_TASKS_V5 } from "./weekly-planner-generator-form.data";
import "./weekly-planner-generator-form.styles.css";

enum StartStatus {
  NOT_SET = "NOT_SET",
  INVALID = "INVALID",
  VALID = "VALID",
}
const MONDAY_INDEX = 0;
type DailyTaskWeeklyGeneratorFormProps = { onClose: () => void };
const DailyTaskWeeklyGeneratorFormComponent = ({ onClose = () => {} }: DailyTaskWeeklyGeneratorFormProps) => {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [startStatus, setStartStatus] = useState<StartStatus>(StartStatus.NOT_SET);
  const [weekStart, setWeekStart] = useState<string>("");
  const [weekTasks, setWeekTasks] = useState<WeekTask[]>([]);

  useEffect(() => {
    setDailyTasks(DAILY_TASKS_V3.map((dt) => ({ ...dt })));
    setWeekTasks(WEEKLY_TASKS_V5.map((wt) => ({ ...wt })));
  }, []);

  useEffect(() => {
    if (weekStart === "") {
      setStartStatus(StartStatus.NOT_SET);
      return;
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
    const hasInvalidDailyTask = dailyTasks.some((dt) => !dt.name || dt.points <= 0 || dt.weeklyMax <= 0);
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
      <div className="FormButtonsContainer">
        <button onClick={handleClickSubmit}>Submit</button>
        <button className="FormBackButton" onClick={onClose}>
          Back
        </button>
      </div>
      <div>
        <label htmlFor="date">week start date</label>
        <input
          className={classNames("FormStartDateInput", startStatus === StartStatus.INVALID && "InvalidFormInput")}
          name="date"
          onChange={handleChangeWeek}
          type="date"
          value={weekStart}
        />
      </div>
      <h4>daily tasks</h4>
      <div>
        <div>
          <span className="FormDailyTaskHeader">name</span>
          <span className="FormDailyTaskHeader">points</span>
          <span className="FormDailyTaskHeader">weekly max</span>
        </div>
        {dailyTasks.map((task) => {
          return (
            <div key={task.id}>
              <button onClick={() => handleClickDeleteDailyTask(task.id)}>DEL</button>
              <input
                className={classNames(!task.name && "InvalidFormInput")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDailyTaskName(task.id, e.target.value)}
                type="text"
                value={task.name}
              />
              <input
                className={classNames((!task.points || task.points < 0) && "InvalidFormInput")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDailyTaskPoints(task.id, e.target.value)}
                type="number"
                value={task.points}
              />
              <input
                className={classNames((!task.weeklyMax || task.weeklyMax < 0) && "InvalidFormInput")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeDailyTaskWeeklyMax(task.id, e.target.value)}
                type="number"
                value={task.weeklyMax}
              />
            </div>
          );
        })}
      </div>
      <button onClick={() => handleClickAddDailyTask()}>Add Daily Task</button>
      <h4>week tasks</h4>
      <div>
        <div>
          <span className="FormDailyTaskHeader">name</span>
          <span className="FormDailyTaskHeader">points</span>
        </div>
        {weekTasks.map((task) => {
          return (
            <div key={task.id}>
              <button onClick={() => handleClickDeleteWeekTask(task.id)}>DEL</button>
              <input
                className={classNames(!task.name && "InvalidFormInput")}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeWeekTaskName(task.id, e.target.value)}
                type="text"
                value={task.name}
              />
              <input
                className={classNames((!task.points || task.points < 0) && "InvalidFormInput")}
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

export default DailyTaskWeeklyGeneratorFormComponent;
