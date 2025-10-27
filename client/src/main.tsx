import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './core/App/index.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GlobalStyles } from './core/GlobalStyles.ts';
import { ThemeProvider } from 'styled-components';
import { theme } from './core/theme.ts';
import { BrowserRouter } from 'react-router-dom';
const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
