import { create } from "zustand";

interface ModalState {
  isCreateOpen: boolean;
  isViewOpen: boolean;
  isEditOpen: boolean;

  openCreateModal: () => void;
  closeCreateModal: () => void;
  openViewModal: () => void;
  closeViewModal: () => void;
  openEditModal: () => void;
  closeEditModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isCreateOpen: false,
  isViewOpen: false,
  isEditOpen: false,
  openCreateModal: () => set({ isCreateOpen: true }),
  closeCreateModal: () => set({ isCreateOpen: false }),
  openViewModal: () => set({ isViewOpen: true }),
  closeViewModal: () => set({ isViewOpen: false }),
  openEditModal: () => set({ isEditOpen: true }),
  closeEditModal: () => set({ isEditOpen: false }),
}));
