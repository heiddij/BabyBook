import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { renderWithStore } from '../../utils/test-utils'
import LoginForm from './LoginForm'
import loginService from '../../services/login'
import babyService from '../../services/babies'

vi.mock('../../services/login', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: {
      login: vi.fn(),
    },
  }
})

vi.mock('../../services/babies', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: {
      setToken: vi.fn(),
    },
  }
})

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = () =>
    renderWithStore(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
      {
        preloadedState: {},
      }
    )

  it('renders the login form correctly', () => {
    renderComponent()

    expect(screen.getByText(/kirjaudu sisään/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /kirjaudu/i })).toBeInTheDocument()
    expect(screen.getByText(/ei vielä käyttäjätunnusta/i)).toBeInTheDocument()
    expect(screen.getByText(/rekisteröidy/i)).toBeInTheDocument()
  })

  it('shows validation messages for invalid input', async () => {
    renderComponent()

    const submitButton = screen.getByRole('button', { name: /kirjaudu/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getAllByText(/kirjoita käyttäjänimi/i).length).toBeGreaterThan(0)
    })
  })

  it('handles successful login', async () => {
    const user = {
      token: 'test-token',
      username: 'testuser',
      id: 1,
    }
    loginService.login.mockResolvedValue(user)

    const { store } = renderComponent()

    fireEvent.input(screen.getByLabelText(/käyttäjänimi/i), { target: { value: 'testuser' } })
    fireEvent.input(screen.getByLabelText(/salasana/i), { target: { value: 'password' } })

    fireEvent.click(screen.getByRole('button', { name: /kirjaudu/i }))

    await waitFor(() => {
      expect(loginService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password',
      })
      expect(babyService.setToken).toHaveBeenCalledWith('test-token')
      expect(store.getState().user).toEqual(user)
    })

    expect(screen.getByText(/kirjautuminen onnistui/i)).toBeInTheDocument()
  })

  it('handles login failure', async () => {
    loginService.login.mockRejectedValue({
      response: { data: { error: 'Virheellinen käyttäjänimi tai salasana' } },
    })

    renderComponent()

    fireEvent.input(screen.getByLabelText(/käyttäjänimi/i), { target: { value: 'wronguser' } })
    fireEvent.input(screen.getByLabelText(/salasana/i), { target: { value: 'wrongpassword' } })

    fireEvent.click(screen.getByRole('button', { name: /kirjaudu/i }))

    await waitFor(() => {
      expect(loginService.login).toHaveBeenCalledWith({
        username: 'wronguser',
        password: 'wrongpassword',
      })
    })

    expect(screen.getByText(/virheellinen käyttäjänimi tai salasana/i)).toBeInTheDocument()
  })

  it('displays a generic error message on unknown error', async () => {
    loginService.login.mockRejectedValue({})

    renderComponent()

    fireEvent.input(screen.getByLabelText(/käyttäjänimi/i), { target: { value: 'testuser' } })
    fireEvent.input(screen.getByLabelText(/salasana/i), { target: { value: 'password' } })

    fireEvent.click(screen.getByRole('button', { name: /kirjaudu/i }))

    await waitFor(() => {
      expect(loginService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password',
      })
    })

    expect(screen.getByText(/jokin meni vikaan/i)).toBeInTheDocument()
  })
})