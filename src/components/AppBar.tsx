import { invoke } from "@tauri-apps/api";
import { useTaskGroups } from "../hooks/useTaskGroup";
import { useTasks } from "../hooks/useTasks";
import { DraggableItem } from "../types/item";

type AppBarProps = {
  tasks: DraggableItem[];
};

const AppBar: React.FC<AppBarProps> = ({ tasks }) => {
  // const [swapTaskGroups, tasks, updateTasks, swapTasks, deleteTasks] =
  //   useTaskGroups();
  // const [tasks, updateTasks, swapTasks, alignTasks, deleteTasks] = useTasks();

  console.log(tasks);
  const save = async () => {
    console.log(tasks);
    await invoke("save_ticket", {
      tickets: tasks,
    });
  };
  return (
    <div className="flex h-14 items-center justify-between gap-12 bg-cyan-600 dark:bg-gray-900">
      <span className="ml-4 text-gray-50">Tauri Kanban</span>
      <button
        className="border border-cyan-600 dark:border-gray-50 rounded-md px-1 m-8 dark:hover:bg-gray-300 dark:hover:text-gray-900"
        onClick={() => {
          save();
        }}
      >
        <div className="mx-1">save</div>
      </button>
    </div>
  );
};

export default AppBar;
