import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useDispatch } from 'react-redux'
import BabyPostForm from './BabyPostForm'
import { createPost } from '../../reducers/postReducer'
import * as postService from '../../services/posts'

vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}))

vi.mock('../../reducers/postReducer', () => ({
  createPost: vi.fn(() => (dispatch) => Promise.resolve())
}))

/* vi.mock('../../services/posts', () => ({
  create: vi.fn(),
})) */

describe('BabyPostForm', () => {
  const mockDispatch = vi.fn()
  const baby = { id: 1 }

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
    const errorMessage = 'Jokin meni vikaan'
    postService.create.mockRejectedValueOnce(new Error(errorMessage))

    render(<BabyPostForm baby={baby} />)

    fireEvent.input(screen.getByLabelText(/julkaisu/i), { target: { value: 'Test Post' } })

    fireEvent.click(screen.getByRole('button', { name: /julkaise/i }))

    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument()
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
