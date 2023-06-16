import { Auth0Provider } from '@auth0/auth0-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './app/App';
import './styles/index.css';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <Auth0Provider
        domain={process.env.DOMAIN || ''}
        clientId={process.env.AUTH_ID || ''}
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>
    </StrictMode>
  );
} else {
  console.error('Container element not found.');
}
