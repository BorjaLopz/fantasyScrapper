import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { createContext, MutableRefObject, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import axios from "axios"
import { API_URL } from '@/constants/Api';

const AuthContext = createContext<{
  signIn: (username: string, password: string) => void;
  signOut: () => void
  token: MutableRefObject<string | null> | null;
  isLoading: boolean
}>({
  signIn: () => null,
  signOut: () => null,
  token: null,
  isLoading: true
});

// This hook can be used to access the user info.
export function useAuthSession() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }): ReactNode {
  const tokenRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async (): Promise<void> => {
      const token = await AsyncStorage.getItem('@token');
      tokenRef.current = token || '';
      setIsLoading(false);
    })()
  }, []);

  const signIn = useCallback(async (username: string, password: string) => {
    try {
      const result = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      })
      console.log("test", result.data)
      await AsyncStorage.setItem('@token', result.data.data.token);
      tokenRef.current = result.data.data.token;
      router.replace('/')
    } catch (error) {
      console.log("ERROR", error)
    }
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.setItem('@token', '');
    tokenRef.current = null;
    router.replace('/login');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        token: tokenRef,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};