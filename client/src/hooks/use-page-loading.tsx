import { create } from "zustand";

interface PageLoadingState {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const usePageLoading = create<PageLoadingState>((set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
}));