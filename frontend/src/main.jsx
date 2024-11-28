import ReactDOM from 'react-dom/client'

import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'

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

const babies = [
  {
    id: 1,
    firstName: 'Miinu',
    lastName: 'Makela',
    birthDate: '22.05.2024',
    birthPlace: 'Tampere'
  },
  {
    id: 2,
    firstName: 'Amanda',
    lastName: 'Lahtinen',
    birthDate: '03.12.2023',
    birthPlace: 'Turku'
  },
  {
    id: 3,
    firstName: 'Mikko',
    lastName: 'Lahtinen',
    birthDate: '03.12.2023',
    birthPlace: 'Turku'
  },
  {
    id: 4,
    firstName: 'Lassi',
    lastName: 'Lyytinen',
    birthDate: '14.10.2024',
    birthPlace: 'Joensuu'
  },
  {
    id: 5,
    firstName: 'Kalle',
    lastName: 'Lyytinen',
    birthDate: '25.09.2023',
    birthPlace: 'Joensuu'
  },
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <App users={users} babies={babies} />
    </BrowserRouter>
  </Provider>

  // store is not defined
)