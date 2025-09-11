import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AdminAuthProvider } from './components/provider/AdminAuthProvider.jsx';
import { UserAuthProvider } from './components/provider/UserAuthProvider.jsx';
import { router } from './components/router/Routes.jsx';
import './index.css';
import { CartProvider } from './components/provider/CartProvider.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <UserAuthProvider>
        <CartProvider>
        <HelmetProvider>
          <ToastContainer position="top-center" reverseOrder={false} />
            <RouterProvider router={router}/>
        </HelmetProvider>
        </CartProvider>
      </UserAuthProvider>
    </AdminAuthProvider>
  </StrictMode>,
)
