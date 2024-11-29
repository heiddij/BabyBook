import ReactDOM from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import babyReducer from './reducers/babyReducer'
import { users, babies } from './data'

// Vaihda configureStoreen
const store = configureStore(babyReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App users={users} babies={babies} />
    </BrowserRouter>
  </Provider>
)