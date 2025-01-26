import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Posts from './PostList'
import { renderWithStore } from '../../utils/test-utils'

describe('PostList Component', () => {
  const mockBaby = { id: 1, firstname: 'Baby', profilepic: '/baby-pic.jpg' }
  const mockUser = { username: 'testuser' }
  const mockPosts = [
    {
      id: 1,
      createdAt: '2023-01-01T14:00:00+02:00',
      post: 'First baby post',
      image: '/image1.jpg',
      babyId: 1,
      likers: []
    },
    {
      id: 2,
      createdAt: '2023-01-02T14:00:00+02:00',
      post: 'Second baby post',
      image: '/image2.jpg',
      babyId: 1,
      likers: []
    },
    {
      id: 3,
      createdAt: '2023-01-03T14:00:00+02:00',
      post: 'Unrelated post',
      image: '/image3.jpg',
      babyId: 2,
      likers: []
    }
  ]

  it('renders only posts associated with the provided baby', () => {
    renderWithStore(<Posts baby={mockBaby} user={mockUser} />, {
      preloadedState: { posts: mockPosts }
    })

    const posts = screen.getAllByTestId('post-card')
    expect(posts).toHaveLength(2)

    expect(posts[0]).toHaveTextContent('First baby post')
    expect(posts[1]).toHaveTextContent('Second baby post')
  })

  it('renders nothing if there are no posts for the given baby', () => {
    const mockEmptyBaby = { id: 99, firstname: 'NoBaby' }

    renderWithStore(<Posts baby={mockEmptyBaby} user={mockUser} />, {
      preloadedState: { posts: mockPosts }
    })

    expect(screen.queryByTestId('post-card')).not.toBeInTheDocument()
  })

  it('renders all details for each baby post', () => {
    renderWithStore(<Posts baby={mockBaby} user={mockUser} />, {
      preloadedState: { posts: [mockPosts[0]] }
    })

    const post = screen.getByTestId('post-card')
    expect(post).toHaveTextContent('testuser')
    expect(post).toHaveTextContent('Baby')
    expect(post).toHaveTextContent('First baby post')
    expect(screen.getByAltText('Baby\'s profilepic')).toHaveAttribute('src', '/baby-pic.jpg')
    expect(screen.getByAltText('Baby\'s post')).toHaveAttribute('src', '/image1.jpg')
  })
})
