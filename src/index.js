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
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
    <UserProvider>
      <React.StrictMode>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </React.StrictMode>
    </UserProvider>
  </GoogleOAuthProvider>
);
