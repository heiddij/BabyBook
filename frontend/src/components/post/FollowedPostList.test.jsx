import { screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FollowedPostList from './FollowedPostList'
import { renderWithStore } from '../../utils/test-utils'
import { initializeFollowedUsersPosts } from '../../reducers/followedPostsReducer'
import { useDispatch } from 'react-redux'


vi.mock(import('react-redux'), async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useDispatch: vi.fn()
  }
})

vi.mock('../../reducers/followedPostsReducer', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: actual.default,
    initializeFollowedUsersPosts: vi.fn(() => async (dispatch) => {
      dispatch({ type: 'followedPosts/initializeFollowedUsersPosts' })
      return Promise.resolve()
    }),
  }
})

vi.mock('../ui/Spinner', () => ({
  default: () => <div>Loading...</div>,
}))

describe('FollowedPostsList Component', () => {
  const mockDispatch = vi.fn()
  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch)
    vi.clearAllMocks()
  })

  const mockFollowedPosts = [
    {
      id: 1,
      createdAt: '2023-01-01T14:00:00+02:00',
      post: 'First followed post',
      image: '/image1.jpg',
      followingUser: { username: 'user1' },
      baby: { id: 1, firstname: 'Baby1', profilepic: '/baby1.jpg' },
      likers : []
    },
    {
      id: 2,
      createdAt: '2023-01-02T14:00:00+02:00',
      post: 'Second followed post',
      image: '/image2.jpg',
      followingUser: { username: 'user2' },
      baby: { id: 2, firstname: 'Baby2', profilepic: '/baby2.jpg' },
      likers : []
    }
  ]

  const mockLoggedUser = { id: 1, username: 'user1' }

  it('renders the Spinner while loading', () => {
    initializeFollowedUsersPosts.mockReturnValue(() => new Promise(() => {}))

    act(() => {
      renderWithStore(<FollowedPostList />, {
        preloadedState: { followedPosts: [], user: mockLoggedUser }
      })
    })

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders the followed posts in descending order by date', async () => {
    initializeFollowedUsersPosts.mockResolvedValueOnce(mockFollowedPosts)

    renderWithStore(<FollowedPostList />, {
      preloadedState: { followedPosts: mockFollowedPosts, user: mockLoggedUser }
    })

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    const posts = screen.getAllByText(/followed post/i)
    expect(posts).toHaveLength(2)

    expect(posts[0]).toHaveTextContent('Second followed post')
    expect(posts[1]).toHaveTextContent('First followed post')
  })

  it('renders "Ei julkaisuja saatavilla" when there are no followed posts', async () => {
    initializeFollowedUsersPosts.mockResolvedValue([])

    renderWithStore(<FollowedPostList />, {
      preloadedState: { followedPosts: [], user: mockLoggedUser }
    })

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Ei julkaisuja saatavilla')).toBeInTheDocument()
  })

  it('renders post details correctly', async () => {
    initializeFollowedUsersPosts.mockResolvedValueOnce(mockFollowedPosts)

    renderWithStore(<FollowedPostList />, {
      preloadedState: { followedPosts: [mockFollowedPosts[0]], user: mockLoggedUser }
    })

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('Baby1')).toBeInTheDocument()
    expect(screen.getByText('First followed post')).toBeInTheDocument()
    expect(screen.getByAltText('Baby1\'s profilepic')).toHaveAttribute('src', '/baby1.jpg')
    expect(screen.getByAltText('Baby\'s post')).toHaveAttribute('src', '/image1.jpg')
  })
})