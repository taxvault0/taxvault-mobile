import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer } from '@react-navigation/native';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ThemeProvider } from '@/core/providers/ThemeContext';
import AppNavigator from '@/core/navigation/AppNavigator';
import { paperTheme } from '@/styles/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    const prepare = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await SplashScreen.hideAsync();
    };

    prepare();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider>
              <AuthProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </AuthProvider>
            </ThemeProvider>
          </PaperProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}