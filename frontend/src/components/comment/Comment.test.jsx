import { render, screen } from '@testing-library/react'
import { describe, it, vi, expect } from 'vitest'
import { formatDateTime } from '../../utils/formatDate'
import Comment from './Comment'

vi.mock('../../utils/formatDate', () => ({
  formatDateTime: vi.fn().mockReturnValue('2025-01-28T12:00:00Z'),
}))

describe('Comment component', () => {
  const comment = {
    id: 1,
    user: {
      username: 'TestUser',
    },
    createdAt: '2025-01-28T12:00:00Z',
    content: 'Test comment',
  }

  it('renders comment username, timestamp, and content', () => {
    render(<Comment comment={comment} />)

    expect(screen.getByText('TestUser')).toBeInTheDocument()
    expect(screen.getByText('2025-01-28T12:00:00Z')).toBeInTheDocument()
    expect(screen.getByText('Test comment')).toBeInTheDocument()
  })

  it('renders null if comment is not provided', () => {
    render(<Comment comment={null} />)

    expect(screen.queryByText('TestUser')).not.toBeInTheDocument()
    expect(screen.queryByText('2025-01-28T12:00:00Z')).not.toBeInTheDocument()
    expect(screen.queryByText('Test comment')).not.toBeInTheDocument()
  })

  it('formats the createdAt date correctly using formatDateTime', () => {
    render(<Comment comment={comment} />)
    expect(formatDateTime).toHaveBeenCalledWith(comment.createdAt)
  })
})
