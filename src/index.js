// src/index.js
import React, { Suspense } from 'react'; // <<< Thêm Suspense
import ReactDOM from 'react-dom/client';
import './index.css'; // File CSS chính của bạn
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom'; // Giả sử bạn đang dùng react-router
import './components/i18n'; // <<< Import cấu hình i18next (quan trọng!)
import { Provider } from 'react-redux';
import store from './redux/store';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>
    <Provider store={store}>
      <Router>
         <App />
      </Router>
    </Provider>
    </Suspense>
  </React.StrictMode>
);

reportWebVitals();