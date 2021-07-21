import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/core/styles';

import { GQLProvider, options } from './lib/urql';
import { AuthProvider } from './lib/auth';
import { endpoint } from './config';
import theme from './utils/theme';
import App from './App';
import './index.css';

import reportWebVitals from './reportWebVitals';
// set app endpoint
options.url = endpoint;

ReactDOM.render(
    <React.StrictMode>
        <GQLProvider options={options}>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </ThemeProvider>
        </GQLProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
