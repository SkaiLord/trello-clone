"use client";

import {
  FormEvent,
  Fragment,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";
import getUrl from "@/lib/getUrl";

function CreateModal() {
  const [isCreateOpen, isEditOpen, closeCreateModal, closeEditModal] =
    useModalStore((state) => [
      state.isCreateOpen,
      state.isEditOpen,
      state.closeCreateModal,
      state.closeEditModal,
    ]);

  const [
    task,
    addTask,
    editTask,
    newTaskInput,
    setNewTaskInput,
    newTaskType,
    image,
    setImage,
  ] = useBoardStore((state) => [
    state.task,
    state.addTask,
    state.editTask,
    state.newTaskInput,
    state.setNewTaskInput,
    state.newTaskType,
    state.image,
    state.setImage,
  ]);

  const imagePickerRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (task.image) {
      const fetchImage = async () => {
        const url = await getUrl(task.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };
      fetchImage();
    }
  }, [task]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    // add task to board
    addTask(newTaskInput, newTaskType, image);
    // initialise to default-zero
    setImage(null);
    closeCreateModal();
  };

  const handleEditSubmit = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    editTask(task, newTaskInput, newTaskType, image);
    setImage(null);
    setImageUrl(null);
    closeEditModal();
  };

  const handleCancel = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    setNewTaskInput("");
    setImage(null);
    setImageUrl(null);
    if (isCreateOpen) closeCreateModal();
    else closeEditModal();
  };

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isCreateOpen || isEditOpen} as={Fragment}>
      <Dialog
        as="form"
        className="relative z-10"
        onClose={isCreateOpen ? closeCreateModal : closeEditModal}
        onSubmit={handleSubmit}
      >
        {/*
          Use one Transition.Child to apply one transition to the backdrop...
        */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        {/*
          ...and another Transition.Child to apply a separate transition
          to the contents.
        */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center text-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Task
                </Dialog.Title>
                {/* Task input */}
                <div className="mt-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter a task here..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>
                {/* Radio group - TypedColumns */}
                <TaskTypeRadioGroup />
                {/* Image input field */}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      imagePickerRef.current?.click();
                    }}
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                    Upload Image
                  </button>
                  {/* Display uploaded image */}
                  {image && (
                    <Image
                      alt="Uploaded Image"
                      width={200}
                      height={200}
                      className="w-full h-44 object-cover mt-2 filter transition-all duration-150 cursor-not-allowed hover:grayscale"
                      src={URL.createObjectURL(image)}
                      onClick={() => {
                        setImage(null);
                      }}
                    />
                  )}
                  {imageUrl && (
                    <Image
                      alt="Uploaded Image"
                      width={200}
                      height={200}
                      className="w-full h-44 object-cover mt-2 filter transition-all duration-150 cursor-not-allowed hover:grayscale"
                      src={imageUrl}
                      onClick={() => {
                        setImageUrl(null);
                      }}
                    />
                  )}
                  <input
                    type="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      // check if e is an image
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImage(e.target.files![0]);
                    }}
                  />
                </div>
                {/* Add task button */}
                <div className="mt-4 flex justify-between">
                  <button
                    type="submit"
                    disabled={!newTaskInput}
                    className={`${
                      isEditOpen ? "hidden" : "flex"
                    } justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed`}
                  >
                    Add Task
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={!isEditOpen}
                    className={`${
                      isEditOpen ? "flex" : "hidden"
                    } justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed`}
                  >
                    Save
                  </button>
                  <button
                    type="reset"
                    onClick={handleCancel}
                    disabled={!newTaskInput}
                    className="flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default CreateModal;
