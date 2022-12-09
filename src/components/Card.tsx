import { FC, useState } from "react";
import { DraggableItem } from "../types/item";

type CardProps = {
  task: DraggableItem;
  deleteTasks: (target: DraggableItem) => void;
};

export const Card: FC<CardProps> = ({ task, deleteTasks }) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <>
      <div className="flex cursor-move content-start items-start rounded-md bg-white p-4 dark:bg-gray-700">
        <div className="flex-1 px-4 text-sm dark:text-gray-100">
          {task.contents}
        </div>

        <button
          className=""
          onClick={() => {
            setShow(!show);
          }}
        >
          <div className="h-4 w-4 dark:text-gray-100">:</div>
          {show ? (
            <div className="absolute z-50 list-none rounded border bg-white text-left text-sm">
              <ul className="">
                <li className="py-1 px-4 hover:bg-gray-100 dark:text-gray-900">
                  <div
                    onClick={() => {
                      return;
                    }}
                  >
                    Edit
                  </div>
                </li>
                <li className="py-1 px-4 hover:bg-gray-100 dark:text-gray-900">
                  <div
                    onClick={() => {
                      deleteTasks(task);
                    }}
                  >
                    Delete
                  </div>
                </li>
              </ul>
            </div>
          ) : (
            <></>
          )}
        </button>
      </div>
    </>
  );
};
