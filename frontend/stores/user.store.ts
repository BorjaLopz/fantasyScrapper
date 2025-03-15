import { User } from "@/types/user.type";
import { create } from "zustand";

type Store = {
  user: User;
  setUser: (newUser: User) => void;
};

export const useUserStore = create<Store>()((set) => ({
  user: {} as User,
  setUser: (newUser: User) => set((state) => ({ user: newUser })),
}));
