import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


const socketCounter = new WebSocket('ws://localhost:9090/pingCounter');

// Connection opened
socketCounter.addEventListener('open',  (event) => {
    socketCounter.send('Hello Server!');
});

// Listen for messages
socketCounter.addEventListener('message',  (event) => {
    console.log('Message from server ', event.data);
});



ReactDOM.render(
    <App/>,
    document.getElementById('root') as HTMLElement);
registerServiceWorker();