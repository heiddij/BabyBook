import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDispatch } from 'react-redux'
import { createBaby, updateBaby } from '../../reducers/babyReducer'
import BabyForm from './BabyForm'
import * as babyService from '../../services/babies'

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}))

vi.mock('../../reducers/babyReducer', () => ({
  createBaby: vi.fn(() => (dispatch) => Promise.resolve()),
  updateBaby: vi.fn(() => (dispatch) => Promise.resolve())
}))

vi.mock('../../services/babies', () => ({
  create: vi.fn(), // Mock the create function
}))

describe('BabyForm component', () => {
  const mockDispatch = vi.fn()
  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    vi.clearAllMocks()
  })

  it('renders all input fields', () => {
    render(<BabyForm />)

    expect(screen.getByLabelText(/etunimi/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/sukunimi/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/syntymäaika/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/syntymäpaikka/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/lataa kuva/i)).toBeInTheDocument()
  })

  it('submits the form and dispatches createBaby', async () => {
    render(<BabyForm />)

    fireEvent.input(screen.getByLabelText(/etunimi/i), { target: { value: 'John' } })
    fireEvent.input(screen.getByLabelText(/sukunimi/i), { target: { value: 'Doe' } })
    fireEvent.input(screen.getByLabelText(/syntymäaika/i), { target: { value: '2023-01-01' } })
    fireEvent.input(screen.getByLabelText(/syntymäpaikka/i), { target: { value: 'Helsinki' } })
    const file = new File(['profile'], 'profile.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText(/lataa kuva/i), { target: { files: [file] } })

    fireEvent.click(screen.getByRole('button', { name: /tallenna/i }))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function))
      expect(createBaby).toHaveBeenCalled()
    })

    const successMessage = await screen.findByText(/vauvan tallennus onnistui/i)
    expect(successMessage).toBeInTheDocument()
  })

  it('submits the form in edit mode and dispatches updateBaby', async () => {
    const baby = {
      id: '1',
      firstname: 'Jane',
      lastname: 'Doe',
      birthdate: '2023-01-01',
      birthplace: 'Espoo',
      profilepic: '/jane.jpg'
    }

    render(<BabyForm baby={baby} />)

    expect(screen.getByLabelText(/etunimi/i)).toHaveValue(baby.firstname)
    expect(screen.getByLabelText(/sukunimi/i)).toHaveValue(baby.lastname)
    expect(screen.getByLabelText(/syntymäaika/i)).toHaveValue(baby.birthdate)
    expect(screen.getByLabelText(/syntymäpaikka/i)).toHaveValue(baby.birthplace)

    fireEvent.change(screen.getByLabelText(/syntymäpaikka/i), { target: { value: 'Vantaa' } })

    fireEvent.click(screen.getByRole('button', { name: /tallenna/i }))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function))
      expect(updateBaby).toHaveBeenCalledWith(baby.id, expect.any(FormData))
    })

    expect(screen.getByText(/vauvan tallennus onnistui/i)).toBeInTheDocument()
  })

  it('shows error message on submission failure', async () => {
    const mError = new Error('Virhe tallennuksessa')
    createBaby.mockRejectedValueOnce(mError)

    render(<BabyForm />)

    fireEvent.input(screen.getByLabelText(/etunimi/i), { target: { value: 'John' } })
    fireEvent.input(screen.getByLabelText(/sukunimi/i), { target: { value: 'Doe' } })
    fireEvent.input(screen.getByLabelText(/syntymäaika/i), { target: { value: '2023-01-01' } })
    fireEvent.input(screen.getByLabelText(/syntymäpaikka/i), { target: { value: 'Helsinki' } })

    fireEvent.click(screen.getByRole('button', { name: /tallenna/i }))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByText(/virhe tallennuksessa/i)).toBeInTheDocument()
    })
  })

  it('renders validation error if required fields are not filled', async () => {
    render(<BabyForm />)

    // Click submit without filling out the form
    fireEvent.click(screen.getByRole('button', { name: /tallenna/i }))

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(screen.getByText(/kirjoita etunimi/i)).toBeInTheDocument()
      expect(screen.getByText(/kirjoita sukunimi/i)).toBeInTheDocument()
      expect(screen.getByText(/kirjoita syntymäaika/i)).toBeInTheDocument()
    })
  })
})
