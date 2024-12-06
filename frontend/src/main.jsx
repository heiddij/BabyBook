import ReactDOM from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import babyReducer from './reducers/babyReducer'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)