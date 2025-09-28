import { create } from "zustand";

type S = { token: string | null; setToken: (t: string | null) => void };
export const useAuth = create<S>(set => ({
	token: null,
	setToken: t => set({ token: t }),
}));
