import { fireEvent, screen } from '@testing-library/react'
import Post from './Post'
import { describe, it, expect, vi } from 'vitest'
import { renderWithStore } from '../../utils/test-utils'
import { likePost, unlikePost } from '../../reducers/postReducer'

vi.mock('../../reducers/postReducer', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: actual.default,
    likePost: vi.fn(() => ({ type: 'posts/likePost' })),
    unlikePost: vi.fn(() => ({ type: 'posts/unlikePost' })),
  }
})

describe('Post Component', () => {
  const mockUser = { id: 1, username: 'testuser' }
  const mockLoggedUser = { id: 2 }
  const mockBaby = { id: 1, firstname: 'Baby', profilepic: '/baby-pic.jpg' }
  const mockPost = {
    createdAt: '2023-01-01T12:00:00+02:00',
    post: 'Hello world!',
    image: '/image.jpg',
    likers: []
  }

  it('renders the username correctly', () => {
    renderWithStore(<Post user={mockUser} baby={mockBaby} post={mockPost} />, {
      preloadedState: { user: mockLoggedUser }
    })
    expect(screen.getByText('testuser')).toBeInTheDocument()
  })

  it('renders the baby’s information correctly', () => {
    renderWithStore(<Post user={mockUser} baby={mockBaby} post={mockPost} />, {
      preloadedState: { user: mockLoggedUser }
    })
    expect(screen.getByAltText('Baby\'s profilepic')).toHaveAttribute('src', '/baby-pic.jpg')
    expect(screen.getByText('Baby')).toBeInTheDocument()
  })

  it('renders the post content correctly', () => {
    renderWithStore(<Post user={mockUser} baby={mockBaby} post={mockPost} />, {
      preloadedState: { user: mockLoggedUser }
    })
    expect(screen.getByText('Hello world!')).toBeInTheDocument()
  })

  it('renders the post creation date correctly', () => {
    const formattedDate = '01.01.2023 12:00'
    renderWithStore(<Post user={mockUser} baby={mockBaby} post={mockPost} />, {
      preloadedState: { user: mockLoggedUser }
    })
    expect(screen.getByText(formattedDate)).toBeInTheDocument()
  })

  it('renders the post image correctly', () => {
    renderWithStore(<Post user={mockUser} baby={mockBaby} post={mockPost} />, {
      preloadedState: { user: mockLoggedUser }
    })
    expect(screen.getByAltText('Baby\'s post')).toHaveAttribute('src', '/image.jpg')
  })

  it('handles liking and unliking posts correctly', () => {
    const mockLikedPost = { ...mockPost, likers: [{ id: 2 }] }

    renderWithStore(<Post user={mockUser} baby={mockBaby} post={mockPost} />, {
      preloadedState: { user: mockLoggedUser }
    })

    const likeButton = screen.getByTestId('like-button')
    expect(likeButton).toBeInTheDocument()
    expect(screen.getByTestId('FavoriteBorderIcon')).toBeInTheDocument()

    fireEvent.click(likeButton)
    expect(likePost).toHaveBeenCalledWith(mockPost.id)

    expect(screen.getByTestId('FavoriteIcon')).toBeInTheDocument()

    renderWithStore(<Post user={mockUser} baby={mockBaby} post={mockLikedPost} />, {
      preloadedState: { user: mockLoggedUser }
    })

    fireEvent.click(likeButton)
    expect(unlikePost).toHaveBeenCalledWith(mockPost.id)
  })
})
