import { API_URL } from "@/constants/api";
import { useUserStore } from "@/stores/user.store";
import { ApiResponse } from "@/types/api-response.type";
import { User } from "@/types/user.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AuthContext = createContext<{
  signIn: (username: string, password: string) => void;
  signOut: () => void;
  token: MutableRefObject<string | null> | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  token: null,
  isLoading: true,
});

// This hook can be used to access the user info.
export function useAuthSession() {
  return useContext(AuthContext);
}

export default function AuthProvider({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const tokenRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, setUser } = useUserStore();

  useEffect(() => {
    (async (): Promise<void> => {
      const token = await AsyncStorage.getItem("@token");
      tokenRef.current = token || "";

      if ((!user || Object.keys(user).length === 0) && token) {
        try {
          const result = await axios.get<
            ApiResponse<{
              user: {
                id: string;
                username: string;
                profile: {
                  id: number;
                  firstName: string;
                  lastName: string;
                  avatarUrl: string;
                };
                role: {
                  id: number;
                  name: string;
                };
                bank: {
                  quantity: number;
                };
              };
            }>
          >(`${API_URL}/auth/session`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("result", result.data.data.user);
          setUser({
            id: result.data.data.user.id,
            username: result.data.data.user.username,
            role: result.data.data.user.role,
            profile: result.data.data.user.profile,
            bank: result.data.data.user.bank,
          });
        } catch (error) {
          console.log("ERROR", error);
        }
      }

      setIsLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    try {
      const result = await axios.post<
        ApiResponse<{ token: string; user: User }>
      >(`${API_URL}/auth/login`, {
        username,
        password,
      });
      await AsyncStorage.setItem("@token", result.data.data.token);
      tokenRef.current = result.data.data.token;
      setUser(result.data.data.user);
      router.replace("/");
    } catch (error) {
      console.log("ERROR", error);
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.setItem("@token", "");
    tokenRef.current = null;
    setUser({} as User);
    router.replace("/login");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        token: tokenRef,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
