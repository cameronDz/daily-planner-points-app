import { ChangeEvent } from "react";
import { WeeklyPlanner } from "./week-planner.types";

type WeekPlannerUploadInputProps = { onUpload: (planner: WeeklyPlanner) => void };
const WeekPlannerUploadInputComponent = ({ onUpload = (_planner) => {} }: WeekPlannerUploadInputProps) => {
  const handleUpload = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    if (!changeEvent.target.files?.[0]) {
      return;
    }
    const file = changeEvent.target.files[0];
    const reader = new FileReader();

    reader.onload = (progressEvent: ProgressEvent) => {
      if (!progressEvent.target) {
        return;
      }
      const fileContent = (progressEvent.target as FileReader).result as string;
      try {
        const jsonData = JSON.parse(fileContent);
        sessionStorage.setItem("planner", JSON.stringify(jsonData));
        onUpload(jsonData);
      } catch (error) {
        console.error("error", { error });
      }
    };
    reader.readAsText(file);
  };
  return <input accept=".json" onChange={handleUpload} type="file" />;
};

export default WeekPlannerUploadInputComponent;
