import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from "react"
import { Routes, Route } from "react-router-dom";
import FormLogin from './components/FormLogin';
import FormChat from './containers/FormChat';
import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers'
import thunk from 'redux-thunk'

const store = createStore(rootReducer, applyMiddleware(thunk))
function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<FormLogin />} />
        <Route path='/chat' element={<FormChat />} />
      </Routes>
    </Provider>
  );
}

export default App;
