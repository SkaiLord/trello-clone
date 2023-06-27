"use client";

import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";
import {
  EyeIcon,
  PencilSquareIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const [setNewTaskInput, setNewTaskType, setImage, deleteTask, setTask] =
    useBoardStore((state) => [
      state.setNewTaskInput,
      state.setNewTaskType,
      state.setImage,
      state.deleteTask,
      state.setTask,
    ]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [openViewModal, openEditModel] = useModalStore((state) => [
    state.openViewModal,
    state.openEditModal,
  ]);

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, [todo]);

  const handleViewTodo = () => {
    setTask(todo);
    openViewModal();
  };

  const handleEditTodo = () => {
    setTask(todo);
    setNewTaskInput(todo.title);
    setNewTaskType(todo.status);
    // setImage(imageUrl);
    openEditModel();
  };

  return (
    <div
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
      className="bg-white rounded-md space-y-2 drop-shadow-md"
    >
      {/* Todo header */}
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <div className="flex justify-end lg:gap-x-4 sm:gap-x-2 items-center">
          <button
            onClick={handleViewTodo}
            className="text-slate-500 hover:text-slate-600"
          >
            <EyeIcon className="h-8 w-8" />
          </button>
          <button
            onClick={handleEditTodo}
            className="text-blue-500 hover:text-blue-600"
          >
            <PencilSquareIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => deleteTask(index, todo, id)}
            className="text-red-500 hover:text-red-600"
          >
            <XCircleIcon className="h-8 w-8" />
          </button>
        </div>
      </div>
      {/* Todo image - optional */}
      {imageUrl && (
        <div className="relative h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task Image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}

      {/* Todo body - description+priority */}
    </div>
  );
}

export default TodoCard;
