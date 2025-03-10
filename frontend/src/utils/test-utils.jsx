import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { setupStore } from '../store'

export const renderWithStore = (
  ui,
  {
    preloadedState = {},
    store = setupStore(preloadedState)
  } = {}
) => {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  }
}