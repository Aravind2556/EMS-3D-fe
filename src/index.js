import React from 'react';
import ReactDOM from 'react-dom/client';
import '../src/css/index.css'
import '../src/css/App.css'
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import DContext from './context/Datacontext';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

    <DContext>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </DContext>

);


