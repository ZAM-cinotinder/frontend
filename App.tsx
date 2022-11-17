import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

const queryClient = new QueryClient()

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider>
            <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
          <Toast />
        </SafeAreaProvider>
        </QueryClientProvider>
      </PaperProvider>
    );
  }
}
