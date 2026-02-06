import React, { createContext, useState, useContext, ReactNode } from 'react';

interface MyLoadingContextData {
  isLoading: boolean;
  showMyLoading: () => void;
  hideMyLoading: () => void;
}

const MyLoadingContext = createContext<MyLoadingContextData | undefined>(undefined);

export const MyLoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showMyLoading = () => setIsLoading(true);
  const hideMyLoading = () => setIsLoading(false);

  return (
    <MyLoadingContext.Provider value={{ isLoading, showMyLoading, hideMyLoading }}>
      {children}
    </MyLoadingContext.Provider>
  );
};

export const useMyLoading = (): MyLoadingContextData => {
  const context = useContext(MyLoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};