import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications'; // Added for toasts
import '@mantine/notifications/styles.css'; // Don't forget the styles!

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <MantineProvider>
    <Notifications /> {/* Required for showNotification to work */}
    <App />
  </MantineProvider>,
);
