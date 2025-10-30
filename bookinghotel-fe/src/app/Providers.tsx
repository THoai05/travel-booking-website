'use client';

import { AuthProvider } from '@/context/AuthContext';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/reduxTK/store';
import { Toaster } from 'react-hot-toast';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Toaster position="top-right" reverseOrder={false} />
          {children}
        </PersistGate>
      </Provider>
    </AuthProvider>
  );
}
