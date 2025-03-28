import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import AuthProvider from '@/providers/AuthProvider';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const queryClient = new QueryClient()

  return (
    <>
      <GluestackUIProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <Slot />
          </QueryClientProvider>
        </AuthProvider>
        <StatusBar style="auto" />
      </GluestackUIProvider>
    </>
  );
}
