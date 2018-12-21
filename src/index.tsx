import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

console.log(process.env.REACT_APP_STAGE);
ReactDOM.render(
    <App/>,
    document.getElementById('root') as HTMLElement);
registerServiceWorker();