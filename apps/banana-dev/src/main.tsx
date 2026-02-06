import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './global.css';
const router = createRouter({ routeTree });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

root.render(
  <StrictMode>
    <BrowserRouter>
      <RouterProvider router={router} />
    </BrowserRouter>
  </StrictMode>
);
