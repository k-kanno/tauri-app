import { useState } from "react";
import { useDrop } from "react-dnd";
import { Card } from "./Card";
import { DraggableItem, DraggableItemWithIndex } from "../types/item";
import { Draggable } from "./Draggable";
import { ItemTypes } from "../types/itemTypes";
import { AddTask } from "./AddTask";
import { v4 as uuidv4 } from "uuid";

import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";

type ColumnProps = {
  columnName: string;
  firstIndex: number;
  tasks: DraggableItem[];
  updateTasks: (newTask: DraggableItem, index: number) => void;
  deleteTasks: (target: DraggableItem) => void;
  swapTasks: (dragIndex: number, hoverIndex: number, groupName: string) => void;
};

async function openDialog(
  columnName: string,
  updateTasks: (newTask: DraggableItem, index: number) => void,
  index: number
) {
  /**① @tauri-apps/api/dialog#openで選択したファイルのパスを取得。 */
  const path = await open({ multiple: false });
  /**② create_ticketコマンドを実行。String[]で受け取ったチケット一覧をセットする。 */
  const new_tickets =
    typeof path === "string"
      ? await invoke<string[]>("create_ticket", {
          path: path,
        })
      : [];
  new_tickets.reverse().forEach((new_ticket) => {
    updateTasks(
      {
        key: uuidv4(),
        groupName: columnName,
        contents: new_ticket,
        itemType: ItemTypes.card,
      },
      index
    );
  });
}

export const Column: React.FC<ColumnProps> = ({
  columnName,
  firstIndex,
  tasks,
  updateTasks,
  deleteTasks,
  swapTasks,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayNone = (): void => setIsOpen(false);

  const [, ref] = useDrop({
    accept: ItemTypes.card, // 渡せるようにする
    hover(dragItem: DraggableItemWithIndex) {
      const dragIndex = dragItem.index;
      if (dragItem.groupName === columnName) return;
      const targetIndex =
        dragIndex < firstIndex
          ? // forward
            firstIndex + tasks.length - 1
          : // backward
            firstIndex + tasks.length;
      swapTasks(dragIndex, targetIndex, columnName);
      dragItem.index = targetIndex;
      dragItem.groupName = columnName;
    },
  });

  return (
    <div className="h-[90%] w-auto rounded-lg bg-gray-100 p-2 dark:bg-gray-900">
      <div className="m-2 flex items-center">
        <div className="h-6 w-6 rounded-full bg-slate-200 dark:text-gray-800 text-center">
          {tasks.length}
        </div>
        <span className="ml-2 flex-1">{columnName}</span>
        <button
          className="border border-cyan-600 dark:border-gray-50 rounded-md px-1 m-1"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <div className="mx-1">+</div>
        </button>
        <button
          className="border border-cyan-600 dark:border-gray-50 rounded-md px-1 m-1"
          onClick={() => {
            openDialog(columnName, updateTasks, firstIndex + tasks.length);
          }}
        >
          <div className="mx-1">add from file</div>
        </button>
      </div>
      <div className="h-5/6 overflow-y-auto" ref={ref}>
        <div className="mx-2 mt-2 mb-4">
          {isOpen ? (
            <AddTask
              displayNone={displayNone}
              updateTasks={updateTasks}
              groupName={columnName}
              index={firstIndex + tasks.length}
            />
          ) : (
            <></>
          )}
        </div>
        <ul className="">
          {tasks?.map((task, index) => {
            return (
              <li key={task.key} className="m-2">
                <Draggable
                  item={task}
                  index={firstIndex + index}
                  swapItems={swapTasks}
                >
                  <Card task={task} deleteTasks={deleteTasks}></Card>
                </Draggable>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
