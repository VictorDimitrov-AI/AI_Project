import { createContext, useContext, type ReactNode } from 'react';
import type { IDataService } from '../types';
import { StaticDataService } from './StaticDataService';

const DataServiceContext = createContext<IDataService>(new StaticDataService());

export function DataProvider({
  service,
  children,
}: {
  service?: IDataService;
  children: ReactNode;
}) {
  const value = service ?? new StaticDataService();
  return (
    <DataServiceContext.Provider value={value}>
      {children}
    </DataServiceContext.Provider>
  );
}

export function useDataService(): IDataService {
  return useContext(DataServiceContext);
}
