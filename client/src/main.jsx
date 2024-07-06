import React from 'react';
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ConfigProvider, theme } from 'antd';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './app/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ff4500',
            fontFamily: 'Roboto, sans-serif',
            borderRadius: 8,
            fontSize: 14,
            colorLink: '#00b96b',
            colorLinkHover: '#00b96b',
            colorLinkActive: '#00b96b',
            colorLinkActiveHover: '#00b96b',
          },
        }}
      >
        <Provider store={store}>
          <App />
        </Provider>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>,
  
);
