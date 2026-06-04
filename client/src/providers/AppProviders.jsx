import { Provider } from 'react-redux';

import { store } from '@/app/store';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

import ThemeProvider from './ThemeProvider';

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
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
