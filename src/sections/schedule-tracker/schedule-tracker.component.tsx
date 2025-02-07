import { Fragment, useState } from "react";

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ScheduleTrackerComponent = () => {
  const [schedule, setSchedule] = useState<{ [key: string]: string[] }>({});

  const handleAddEvent = (day: string, hour: string) => {
    setSchedule((prev) => ({ ...prev, [day]: prev[day] ? [...prev[day], hour] : [hour] }));
  };

  return (
    <div className="schedule-tracker-root">
      <div />
      {days.map((day) => (
        <div key={day} className="schedule-tracker-day">
          {day}
        </div>
      ))}
      {hours.map((hour) => (
        <Fragment key={hour}>
          <div className="schedule-tracker-hour">{hour}</div>
          {days.map((day) => (
            <div key={`${day}-${hour}`} className="schedule-tracker-block" onClick={() => handleAddEvent(day, hour)}>
              {schedule[day]?.includes(hour) && <div className="schedule-tracker-event">Event</div>}
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  );
};

export default ScheduleTrackerComponent;
