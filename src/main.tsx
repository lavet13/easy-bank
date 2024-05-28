import App from './App';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from './theme/provider';
import { ColorModeScript } from '@chakra-ui/react';
import theme from './theme';
import ReactQueryProvider from './react-query/react-query-provider';

const root = document.getElementById('root') as HTMLElement;
ReactDOM.hydrateRoot(
  root,
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <BrowserRouter>
      <ReactQueryProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
