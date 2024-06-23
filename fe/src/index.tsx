import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthInit, AuthProvider, setupAxios } from 'auth'
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

setupAxios(axios)

root.render(
  <HelmetProvider>
    <BrowserRouter>
      <AuthProvider>
        <AuthInit>
          <App/>
        </AuthInit>
      </AuthProvider>
    </BrowserRouter>
  </HelmetProvider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
