import { screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { renderWithStore } from '../../utils/test-utils'
import CommentList from './CommentList'

vi.mock(import('react-redux'), async (importOriginal) => {
  const mockDispatch = vi.fn()
  const mockUseDispatch = vi.fn(() => mockDispatch)
  const actual = await importOriginal()
  return {
    ...actual,
    useDispatch: mockUseDispatch
  }
})

const mockPostComments = [
  { id: 1, user: { username: 'user1' }, content: 'Test comment 1', createdAt: '2025-01-01' },
  { id: 2, user: { username: 'user2' }, content: 'Test comment 2', createdAt: '2025-01-02' },
]

vi.mock('../../reducers/commentReducer', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    makeSelectPostComments: vi.fn(() => () => mockPostComments)
  }
})

describe('CommentList component', () => {
  const post = { id: 1 }

  it('renders with comments collapsed', () => {
    renderWithStore(
      <CommentList post={post} />
    )
    expect(screen.queryByText('Kommentit')).toBeInTheDocument()
    expect(screen.queryByText('Test comment 1')).not.toBeInTheDocument()
  })

  it('expands and collapses the comments when clicking the toggle button', async () => {
    renderWithStore(
      <CommentList post={post} />
    )

    const toggleButton = screen.getByLabelText('Expand comments')
    fireEvent.click(toggleButton)

    await waitFor(() => expect(screen.getByText('Test comment 1')).toBeInTheDocument())

    fireEvent.click(toggleButton)

    await waitFor(() => expect(screen.queryByText('Test comment 1')).not.toBeInTheDocument())
  })

  it('renders comment details correctly', async () => {
    renderWithStore(
      <CommentList post={post} />
    )

    const toggleButton = screen.getByLabelText('Expand comments')
    fireEvent.click(toggleButton)

    expect(screen.getByText('Test comment 1')).toBeInTheDocument()
    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('01.01.2025 00:00')).toBeInTheDocument()
  })

  it('renders all the comments when expanded', async () => {
    renderWithStore(
      <CommentList post={post} />
    )

    const toggleButton = screen.getByLabelText('Expand comments')

    fireEvent.click(toggleButton)

    await waitFor(() => expect(screen.getByText('Test comment 1')).toBeInTheDocument())
    expect(screen.getByText('Test comment 2')).toBeInTheDocument()
  })

  it('renders the comment form', async () => {
    renderWithStore(
      <CommentList post={post} />
    )

    const toggleButton = screen.getByLabelText('Expand comments')
    fireEvent.click(toggleButton)

    const input = screen.getByLabelText('Kirjoita kommentti')
    fireEvent.change(input, { target: { value: 'New comment' } })

    const submitButton = screen.getByRole('button', { name: 'Kommentoi' })
    fireEvent.click(submitButton)

    await waitFor(() => screen.queryByText('Kommentti lähetetty'))

    expect(screen.getByText('Kommentti lähetetty')).toBeInTheDocument()
  })
})
