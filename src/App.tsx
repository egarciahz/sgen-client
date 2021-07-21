import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

import './App.css';

class DateUtils extends MomentUtils {
    dateFormat = 'DD/MM/yyyy';
}

function App() {
    return (
        <MuiPickersUtilsProvider libInstance={moment} utils={DateUtils}>
            <div className="App">
                <CssBaseline />
                <div>Content</div>
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default App;
