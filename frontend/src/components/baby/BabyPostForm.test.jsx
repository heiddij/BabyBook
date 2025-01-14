import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDispatch } from 'react-redux'
import BabyPostForm from './BabyPostForm'
import { createPost } from '../../reducers/postReducer'

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}))

vi.mock('../../reducers/postReducer', () => ({
  createPost: vi.fn(() => (dispatch) => Promise.resolve())
}))

describe('BabyPostForm Component', () => {
  const mockDispatch = vi.fn()
  const baby = { id: 1, firstname: 'John', lastname: 'Doe' }

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    vi.clearAllMocks()
  })

  it('renders the form with required fields', () => {
    render(<BabyPostForm baby={baby} />)

    expect(screen.getByLabelText(/julkaisu/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/lataa kuva/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /julkaise/i })).toBeInTheDocument()
  })

  it('calls createPost and shows success message on valid submission', async () => {

    render(<BabyPostForm baby={baby} />)

    fireEvent.input(screen.getByLabelText(/julkaisu/i), { target: { value: 'Test Post' } })
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' })
    fireEvent.change(screen.getByLabelText(/lataa kuva/i), { target: { files: [file] } })

    fireEvent.click(screen.getByRole('button', { name: /julkaise/i }))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })

    expect(createPost).toHaveBeenCalledWith(baby.id, expect.any(FormData))

    await waitFor(() => {
      expect(screen.getByText(/julkaisu onnistui/i)).toBeInTheDocument()
    })
  })

  it('shows an error message on submission failure', async () => {
    const error = {
      response: {
        data: {
          error: 'Virhe tallennuksessa',
        },
      },
    }
    mockDispatch.mockRejectedValueOnce(error)

    render(<BabyPostForm baby={baby} />)

    fireEvent.input(screen.getByLabelText(/julkaisu/i), { target: { value: 'Test Post' } })

    fireEvent.click(screen.getByRole('button', { name: /julkaise/i }))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(screen.getByText(/virhe tallennuksessa/i)).toBeInTheDocument()
    })
  })

  it('does not call createPost if required fields are empty', async () => {
    render(<BabyPostForm baby={baby} />)

    fireEvent.click(screen.getByRole('button', { name: /julkaise/i }))

    await waitFor(() => {
      expect(mockDispatch).not.toHaveBeenCalled()
    })
  })
})
