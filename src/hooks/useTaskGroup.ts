import { invoke } from "@tauri-apps/api";
import { useCallback, useState } from "react";
import { DraggableItem } from "../types/item";
import { useTasks } from "./useTasks";

export const useTaskGroups = (): [
  (indexI: number, indexJ: number) => void,
  DraggableItem[],
  (newTask: DraggableItem, index: number) => void,
  (dragIndex: number, hoverIndex: number, groupName: string) => void,
  (target: DraggableItem) => void
] => {
  const [taskGroups, setTaskGroups] = useState<DraggableItem[]>();

  const [tasks, updateTasks, swapTasks, alignTasks, deleteTasks] = useTasks();

  const swapTaskGroups = useCallback(
    (indexI: number, indexJ: number) => {
      setTaskGroups((current) => {
        if (!current) return;
        const newTaskGroups = current.filter((_, index) => index !== indexI);
        newTaskGroups.splice(indexJ, 0, { ...current[indexI] });
        alignTasks(
          newTaskGroups.map((taskGroup) => {
            return taskGroup.groupName;
          })
        );
        return [...newTaskGroups];
      });
    },
    [taskGroups, setTaskGroups]
  );

  return [swapTaskGroups, tasks ?? [], updateTasks, swapTasks, deleteTasks];
};
