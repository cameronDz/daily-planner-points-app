import { Fragment, useEffect, useState } from "react";
import { DailyTask, WeekTask, WeeklyPlanner } from "../week-planner.types";
import "./table.styles.css";

const DAYS_OF_THE_WEEK = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];
type WeekPlannerTableProps = { onClose: () => void; planner: WeeklyPlanner };
const WeekPlannerTableComponent = ({
  onClose = () => {},
  planner = { dailyTasks: [], weekStart: "", weekTasks: [] },
}: WeekPlannerTableProps) => {
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const [days, setDays] = useState<string[]>([...DAYS_OF_THE_WEEK]);
  const [isPrintView, setIsPrintView] = useState(false);
  const [weekStart, setWeekStart] = useState("");
  const [weekTasks, setWeekTasks] = useState<WeekTask[]>([]);

  useEffect(() => {
    setDailyTasks(planner.dailyTasks.map((dt) => ({ ...dt })));
    setWeekStart(planner.weekStart);
    setWeekTasks(planner.weekTasks.map((wt) => ({ ...wt })));
  }, [planner]);

  useEffect(() => {
    const startDay = new Date();
    const weekValues = weekStart.split("-");
    startDay.setFullYear(Number(weekValues[0]));
    startDay.setMonth(Number(weekValues[1]) - 1);
    startDay.setDate(Number(weekValues[2]));

    setDays(
      [0, 1, 2, 3, 4, 5, 6].map((idx) => {
        const nextDay = new Date(startDay);
        nextDay.setDate(nextDay.getDate() + idx);
        const month = String(nextDay.getMonth() + 1).padStart(2, "0");
        const day = String(nextDay.getDate()).padStart(2, "0");
        return `${DAYS_OF_THE_WEEK[idx]} (${month}/${day})`;
      }),
    );
  }, [weekStart]);

  const handleChangeDailyTask = (id: string, index: number) => {
    const updatedDailyTasks: DailyTask[] = [];
    dailyTasks.forEach((dt) => {
      const updatedDaysComplete: boolean[] = [...(dt.daysComplete || [])];
      if (dt.id === id) {
        updatedDaysComplete[index] = !updatedDaysComplete[index];
      }
      updatedDailyTasks.push({ ...dt, daysComplete: updatedDaysComplete });
    });
    setDailyTasks(updatedDailyTasks);
  };

  const handleChangeWeekTask = (id: string) => {
    const updatedWeekTasks: WeekTask[] = [];
    weekTasks.forEach((wt) => {
      const complete = wt.id === id ? !wt.complete : wt.complete;
      updatedWeekTasks.push({ ...wt, complete });
    });
    setWeekTasks(updatedWeekTasks);
  };

  const handleClickDownload = () => {
    const link = document.createElement("a");
    const jsonStr = JSON.stringify({ dailyTasks, weekStart, weekTasks });
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `weekly-planner-form-${new Date().toISOString()}.json`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClickPrintView = () => {
    setIsPrintView(true);
  };

  const pointsDisplay = (value: number, name: string) => {
    return (
      <Fragment>
        <span className="points-display-name small">{name}</span>
        <sub className="points-display-value">
          ({value}pt{value === 0 || value > 1 ? "s" : ""}.)
        </sub>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div>
        {!isPrintView && (
          <Fragment>
            <button onClick={handleClickDownload}>Submit</button>
            <button onClick={onClose}>Back</button>
            <button onClick={handleClickPrintView}>Print view</button>
          </Fragment>
        )}
      </div>
      <table>
        <thead>
          <tr>
            {days.map((day) => (
              <th key={day} className="table-col-day-header">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dailyTasks.map((dt, idx) => {
            return (
              <tr key={dt.name} className={idx % 2 === 1 ? "table-grey-row" : ""}>
                {DAYS_OF_THE_WEEK.map((day, idx) => (
                  <td key={day}>
                    <input
                      checked={!!dt.daysComplete?.[idx]}
                      className="table-col-input"
                      onChange={() => handleChangeDailyTask(dt.id, idx)}
                      type="checkbox"
                    />
                  </td>
                ))}
                <td>
                  <span className="points-display-name padded">{dt.name}</span>
                  <sub className="points-display-value">
                    ({dt.points}pt{dt.points === 0 || dt.points > 1 ? "s" : ""}.)
                  </sub>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h3 className="weekly-tasks-header">weekly tasks</h3>
      <div className="weekly-tasks-wrapper">
        <table>
          <tbody>
            {weekTasks.map((wt, idx) => {
              return (
                idx % 2 === 0 && (
                  <tr key={wt.name}>
                    <td>
                      <input checked={!!wt.complete} onChange={() => handleChangeWeekTask(wt.id)} type="checkbox" />
                    </td>
                    <td>{pointsDisplay(wt.points, wt.name)}</td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>

        <table className="table-weekly-tasks">
          <tbody>
            {weekTasks.map((wt, idx) => {
              return (
                idx % 2 !== 0 && (
                  <tr key={wt.name}>
                    <td>
                      <input checked={!!wt.complete} onChange={() => handleChangeWeekTask(wt.id)} type="checkbox" />
                    </td>
                    <td>{pointsDisplay(wt.points, wt.name)}</td>
                  </tr>
                )
              );
            })}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default WeekPlannerTableComponent;
