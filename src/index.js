import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Firebase, { FirebaseContext } from './components/Firebase';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';


ReactDOM.render(
    <BrowserRouter>
        <FirebaseContext.Provider value={new Firebase()}>
	     <App />
        </FirebaseContext.Provider>
    </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
