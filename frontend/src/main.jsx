import ReactDOM from 'react-dom/client'

import App from './App'
import { BrowserRouter } from 'react-router-dom'

const users = [
  {
    id: 1,
    username: 'lissu',
    babies: ['Miinu'],
  },
  {
    id: 2,
    username: 'terhi88',
    babies: ['Amanda', 'Mikko'],
  },
  {
    id: 3,
    username: 'pertsa',
    babies: ['Lassi', 'Kalle'],
  }
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App users={users} />
  </BrowserRouter>
)