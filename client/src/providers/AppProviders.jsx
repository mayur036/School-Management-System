import { GoogleOAuthProvider } from '@react-oauth/google';
import { Provider } from 'react-redux';

import { store } from '@/app/store';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useGetMeQuery } from '@/features/auth/auth.api';

import ThemeProvider from './ThemeProvider';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const SessionBootstrap = () => {
  useGetMeQuery();
  return null;
};

const AppProviders = ({ children }) => {
  return (
    <Provider store={store}>
      <SessionBootstrap />
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <ThemeProvider>
          <TooltipProvider>
            {children}
            <Toaster position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
};

export default AppProviders;
