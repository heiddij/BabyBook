import { screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { renderWithStore } from '../../utils/test-utils'
import UserForm from './UserForm'
import { useDispatch } from 'react-redux'
import { createUser } from '../../reducers/usersReducer'

vi.mock('react-redux', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useDispatch: vi.fn(),
    Provider: actual.Provider,
  }
})

vi.mock('../../reducers/usersReducer', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: actual.default,
    createUser: vi.fn(),
  }
})

describe('UserForm Component', () => {
  const mockDispatch = vi.fn()

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    vi.clearAllMocks()
  })

  const renderComponent = () =>
    renderWithStore(
      <MemoryRouter>
        <UserForm />
      </MemoryRouter>,
      {
        preloadedState: {},
      }
    )

  it('renders the user form correctly', () => {
    renderComponent()

    expect(screen.getByLabelText(/etunimi/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sukunimi/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/käyttäjänimi/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/salasana/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rekisteröidy/i })).toBeInTheDocument()
  })

  it('shows validation messages for invalid input', async () => {
    renderComponent()

    fireEvent.click(screen.getByRole('button', { name: /rekisteröidy/i }))

    await waitFor(() => {
      expect(screen.getByText(/kirjoita etunimi/i)).toBeInTheDocument()
      expect(screen.getByText(/kirjoita sukunimi/i)).toBeInTheDocument()
      expect(screen.getByText(/kirjoita käyttäjänimi/i)).toBeInTheDocument()
      expect(screen.getByText(/kirjoita salasana/i)).toBeInTheDocument()
    })
  })

  it('handles successful registration', async () => {
    const user = {
      firstname: 'Test',
      lastname: 'User',
      username: 'testuser',
      password: 'Password123!',
    }

    renderComponent()

    fireEvent.input(screen.getByLabelText(/etunimi/i), { target: { value: user.firstname } })
    fireEvent.input(screen.getByLabelText(/sukunimi/i), { target: { value: user.lastname } })
    fireEvent.input(screen.getByLabelText(/käyttäjänimi/i), { target: { value: user.username } })
    fireEvent.input(screen.getByLabelText(/salasana/i), { target: { value: user.password } })

    fireEvent.click(screen.getByRole('button', { name: /rekisteröidy/i }))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
      expect(createUser).toHaveBeenCalledWith(user)
    })

    expect(screen.getByText(/rekisteröinti onnistui/i)).toBeInTheDocument()
  })

  it('shows error message on registration failure', async () => {
    const error = {
      response: {
        data: {
          error: 'Virhe rekisteröinnissä',
        },
      },
    }
    mockDispatch.mockRejectedValueOnce(error)

    renderComponent()

    fireEvent.input(screen.getByLabelText(/etunimi/i), { target: { value: 'Test' } })
    fireEvent.input(screen.getByLabelText(/sukunimi/i), { target: { value: 'User' } })
    fireEvent.input(screen.getByLabelText(/käyttäjänimi/i), { target: { value: 'testuser' } })
    fireEvent.input(screen.getByLabelText(/salasana/i), { target: { value: 'Password123!' } })

    fireEvent.click(screen.getByRole('button', { name: /rekisteröidy/i }))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
      expect(screen.getByText(/virhe rekisteröinnissä/i)).toBeInTheDocument()
    })
  })
})