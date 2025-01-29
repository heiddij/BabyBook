import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import CommentForm from './CommentForm'
import { BsFillCheckSquareFill, BsFillXSquareFill } from 'react-icons/bs'

const mockHandleCommentSubmit = vi.fn()

describe('CommentForm', () => {
  beforeEach(() => {
    mockHandleCommentSubmit.mockReset()
  })

  it('renders form correctly', () => {
    render(<CommentForm handleCommentSubmit={mockHandleCommentSubmit} />)

    expect(screen.getByLabelText('Kirjoita kommentti')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Kommentoi' })).toBeInTheDocument()
  })

  it('displays success message when comment is successfully submitted', async () => {
    mockHandleCommentSubmit.mockResolvedValue({ success: true, error: null })

    render(<CommentForm handleCommentSubmit={mockHandleCommentSubmit} />)

    const input = screen.getByLabelText('Kirjoita kommentti')
    const button = screen.getByRole('button', { name: 'Kommentoi' })

    fireEvent.change(input, { target: { value: 'Test comment' } })
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockHandleCommentSubmit).toHaveBeenCalled()
    })

    expect(screen.getByText('Kommentti lähetetty')).toBeInTheDocument()
  })

  it('displays error message when comment submission fails', async () => {
    mockHandleCommentSubmit.mockResolvedValue({ success: false, error: 'Tapahtui virhe' })

    render(<CommentForm handleCommentSubmit={mockHandleCommentSubmit} />)

    const input = screen.getByLabelText('Kirjoita kommentti')
    const button = screen.getByRole('button', { name: 'Kommentoi' })

    fireEvent.change(input, { target: { value: 'Test comment' } })
    fireEvent.click(button)

    await waitFor(() => screen.getByText('Tapahtui virhe'))

    expect(screen.getByText('Tapahtui virhe')).toBeInTheDocument()
  })

  it('shows validation error message when the comment is empty', async () => {
    render(<CommentForm handleCommentSubmit={mockHandleCommentSubmit} />)

    const button = screen.getByRole('button', { name: 'Kommentoi' })
    fireEvent.click(button)

    await waitFor(() => screen.getByText('Kommentti ei voi olla tyhjä'))

    expect(screen.getByText('Kommentti ei voi olla tyhjä')).toBeInTheDocument()
  })
})
