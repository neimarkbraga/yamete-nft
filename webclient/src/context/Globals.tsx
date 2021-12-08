import React, { useState, useEffect, useContext, createContext, ComponentProps } from 'react';
import {Box, Button, CircularProgress, CssBaseline, ThemeProvider, Typography} from '@mui/material';
import { MainTheme } from '../themes';
import Api from '../libraries/Api';

export interface Interface {
  config: {
    abi: any
    address: string
  }
}

export const defaultValue: Interface = {
  config: {
    abi: [],
    address: ''
  }
};

export const GlobalsContext = createContext<Interface>(defaultValue);

export const GlobalsProvider = (props: { children: ComponentProps<any>['children'] }) => {
  const { children } = props;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [config, setConfig] = useState<Interface['config']>(defaultValue.config);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const { data } = await Api.get<Interface['config']>('/config');
      setConfig(data);
    } catch (e: any) {
      setErrorMessage(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => await loadData())();
  }, [])

  return (
    <GlobalsContext.Provider value={{
      config
    }}>
      <ThemeProvider theme={ MainTheme }>
        <CssBaseline />
        {(() => {
          if (isLoading)
            return (
              <Box height="100vh" width="100vw" display="flex" alignItems="center" justifyContent="center">
                <Box textAlign="center">
                  <CircularProgress />
                  <Typography>Loading Config</Typography>
                </Box>
              </Box>
            );

          if (errorMessage)
            return (
              <Box height="100vh" width="100vw" display="flex" alignItems="center" justifyContent="center">
                <Box textAlign="center">
                  <Typography variant="h5">Something went wrong</Typography>
                  <Typography mb={1}>{errorMessage}</Typography>
                  <Button variant="contained" size="small" onClick={loadData}>Try Again</Button>
                </Box>
              </Box>
            );

          return children;
        })()}
      </ThemeProvider>
    </GlobalsContext.Provider>
  );
};

export const useGlobals = (): Interface => useContext(GlobalsContext);
