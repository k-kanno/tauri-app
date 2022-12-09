import { DraggableItem } from "../types/item";
import { useState, useCallback, useEffect } from "react";
import { ItemTypes } from "../types/itemTypes";
import { invoke } from "@tauri-apps/api";

export const useTasks = (): [
  DraggableItem[],
  (newTask: DraggableItem, index: number) => void,
  (dragIndex: number, hoverIndex: number, groupName: string) => void,
  (groupNames: string[]) => void,
  (target: DraggableItem) => void
] => {
  const [tasks, setTasks] = useState<DraggableItem[]>([
    // {
    //   key: "",
    //   groupName: "",
    //   contents: "",
    //   type: ItemTypes.card,
    // },
  ]);
  useEffect(() => {
    const read_ticket = async () => setTasks(await invoke("read_ticket"));
    read_ticket();
  }, []);

  const updateTasks = (newTask: DraggableItem, index: number) => {
    setTasks((current) => {
      // setBeforeTasks(current);
      const newTasks = [...(current ?? [])];
      newTasks.splice(index, 0, newTask);
      // const save = async () =>
      //   await invoke("save_ticket", {
      //     tickets: newTasks,
      //   });
      // save();
      return newTasks;
    });
  };

  const swapTasks = useCallback(
    (dragIndex: number, hoverIndex: number, groupName: string) => {
      setTasks((current) => {
        // setBeforeTasks(current);
        // if (!current) return;
        const item = current[dragIndex];
        // if (!item) return;
        const newItems = current?.filter((_, idx) => idx !== dragIndex);
        newItems?.splice(hoverIndex, 0, { ...item, groupName });
        // const save = async () =>
        //   await invoke("save_ticket", {
        //     tickets: newItems,
        //   });
        // save();
        return newItems;
      });
    },
    [tasks, setTasks]
  );

  const deleteTasks = useCallback(
    (target: DraggableItem) => {
      setTasks((current) => {
        // if (!current) return;
        const items = current.filter((item) => {
          return item != target;
        });
        // const save = async () =>
        //   await invoke("save_ticket", {
        //     tickets: items,
        //   });
        // save();
        return items;
      });
    },
    [tasks, setTasks]
  );

  const alignTasks = (groupNames: string[]) => {
    setTasks((current) => {
      // if (!current) return;
      const newTasks: DraggableItem[] = [];
      groupNames.map((groupName) => {
        const grouped = current.filter((task) => {
          return task.groupName == groupName;
        });
        newTasks.push(...grouped);
      });
      return newTasks;
    });
  };

  return [tasks ?? [], updateTasks, swapTasks, alignTasks, deleteTasks];
};
