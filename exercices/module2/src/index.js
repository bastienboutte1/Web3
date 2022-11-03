import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App/App'


const documentElem = document.getElementById('root');
const appProps = {};
const appChildren = null;

const componentElem = React.createElement(App, appProps, appChildren);
ReactDOM.render(
    componentElem,
    documentElem,
    
)