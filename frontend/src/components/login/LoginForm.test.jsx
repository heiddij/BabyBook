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
  const mockHandleLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = () =>
    renderWithStore(
      <MemoryRouter>
        <LoginForm handleLogin={mockHandleLogin} />
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
      username: 'testuser',
      password: 'password',
    }
    mockHandleLogin.mockResolvedValue({ success: true, error: null })

    renderComponent()

    fireEvent.input(screen.getByLabelText(/käyttäjänimi/i), { target: { value: user.username } })
    fireEvent.input(screen.getByLabelText(/salasana/i), { target: { value: user.password } })

    fireEvent.click(screen.getByRole('button', { name: /kirjaudu/i }))

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith(user)
    })

    expect(screen.getByText(/kirjautuminen onnistui/i)).toBeInTheDocument()
  })

  it('handles login failure', async () => {
    const user = {
      username: 'testuser',
      password: 'password',
    }
    const errorMessage = 'Virheellinen käyttäjänimi tai salasana'
    mockHandleLogin.mockResolvedValue({ success: false, error: errorMessage })

    renderComponent()

    fireEvent.input(screen.getByLabelText(/käyttäjänimi/i), { target: { value: user.username } })
    fireEvent.input(screen.getByLabelText(/salasana/i), { target: { value: user.password } })

    fireEvent.click(screen.getByRole('button', { name: /kirjaudu/i }))

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith(user)
    })

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('displays a generic error message on unknown error', async () => {
    const user = {
      username: 'testuser',
      password: 'password',
    }
    mockHandleLogin.mockResolvedValue({ success: false, error: null })

    renderComponent()

    fireEvent.input(screen.getByLabelText(/käyttäjänimi/i), { target: { value: user.username } })
    fireEvent.input(screen.getByLabelText(/salasana/i), { target: { value: user.password } })

    fireEvent.click(screen.getByRole('button', { name: /kirjaudu/i }))

    await waitFor(() => {
      expect(mockHandleLogin).toHaveBeenCalledWith(user)
    })

    expect(screen.getByText(/jokin meni vikaan/i)).toBeInTheDocument()
  })
})