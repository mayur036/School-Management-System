import { Provider } from 'react-redux';

import { store } from '@/app/store';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGetMeQuery } from '@/features/auth/auth.api';

import ThemeProvider from './ThemeProvider';

const SessionBootstrap = () => {
  useGetMeQuery();
  return null;
};

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <SessionBootstrap />
      <ThemeProvider>
        <TooltipProvider>
          {children}
          <Toaster position="top-right" />
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default AppProviders;
