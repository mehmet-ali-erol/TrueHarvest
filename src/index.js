import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './UserContext';
import AppRouter from './AppRouter';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId="70752464639-fl6jrttqq6rkoeb90dqdtl8v3k7l2f2d.apps.googleusercontent.com">
    <UserProvider>
      <React.StrictMode>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </React.StrictMode>
    </UserProvider>
  </GoogleOAuthProvider>
);
