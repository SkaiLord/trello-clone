"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";
import getUrl from "@/lib/getUrl";

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  completed: "Completed",
};

function ViewModal() {
  const [isViewOpen, closeViewModal] = useModalStore((state) => [
    state.isViewOpen,
    state.closeViewModal,
  ]);
  const [task] = useBoardStore((state) => [state.task]);
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

  return (
    <Transition appear show={isViewOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => {
          closeViewModal();
          setImageUrl(null);
        }}
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
                  Task
                </Dialog.Title>
                {/* Task Title and Status */}
                <div className="my-2">Title : {task.title}</div>
                <div className="my-2">
                  Status : {idToColumnText[task.status]}
                </div>
                <div className="my-2">Created at : {task.$createdAt}</div>
                <div className="my-2">
                  {/* Display uploaded image optional */}
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
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ViewModal;
