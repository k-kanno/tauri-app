import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Draggable } from "./components/Draggable";
import { Column } from "./components/Column";
import { useTaskGroups } from "./hooks/useTaskGroup";
import AppBar from "./components/AppBar";
import { v4 as uuidv4 } from "uuid";
import { ItemTypes } from "./types/itemTypes";

const GroupNameList = ["Backlog", "ToDo", "Doing", "Done"];

const newTaskGroup = GroupNameList.map((groupName) => ({
  key: uuidv4(),
  groupName: groupName,
  contents: "",
  itemType: ItemTypes.column,
}));

const App = () => {
  const [swapTaskGroups, tasks, updateTasks, swapTasks, deleteTasks] =
    useTaskGroups();

  let index = 0;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen dark:bg-gray-800 dark:text-gray-50">
        <AppBar tasks={tasks} />
        <div className="h-full m-6 grid grid-cols-4 gap-4 place-items-stretch">
          {newTaskGroup.map((taskGroup, columnIndex) => {
            const groupedTasks = tasks.filter((task) => {
              return task.groupName === taskGroup.groupName;
            });
            const firstIndex = index;
            index = index + groupedTasks.length;
            return (
              <li key={taskGroup.key} className="list-none">
                <Draggable
                  item={taskGroup}
                  index={columnIndex}
                  swapItems={swapTaskGroups}
                >
                  <Column
                    columnName={taskGroup.groupName}
                    firstIndex={firstIndex}
                    tasks={groupedTasks}
                    updateTasks={updateTasks}
                    deleteTasks={deleteTasks}
                    swapTasks={swapTasks}
                  ></Column>
                </Draggable>
              </li>
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
