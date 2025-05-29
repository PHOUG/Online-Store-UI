import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {CategoriesProvider} from "./contexts/CategoriesContext";
import { SelectedCategoriesProvider } from './contexts/SelectedCategoriesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <CategoriesProvider>
          <SelectedCategoriesProvider>
              <App />
          </SelectedCategoriesProvider>
      </CategoriesProvider>
  </React.StrictMode>
);

reportWebVitals();
