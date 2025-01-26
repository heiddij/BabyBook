import { screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FollowedPostList from './FollowedPostList'
import { renderWithStore } from '../../utils/test-utils'

describe('FollowedPostsList Component', () => {
  const mockFollowedPosts = [
    {
      id: 1,
      createdAt: '2023-01-01T14:00:00+02:00',
      post: 'First followed post',
      image: '/image1.jpg',
      followingUser: { username: 'user1' },
      baby: { id: 1, firstname: 'Baby1', profilepic: '/baby1.jpg' }
    },
    {
      id: 2,
      createdAt: '2023-01-02T14:00:00+02:00',
      post: 'Second followed post',
      image: '/image2.jpg',
      followingUser: { username: 'user2' },
      baby: { id: 2, firstname: 'Baby2', profilepic: '/baby2.jpg' }
    }
  ]

  it('renders the heading "BabyBook"', () => {
    renderWithStore(<FollowedPostList />)
    expect(screen.getByText('BabyBook')).toBeInTheDocument()
  })

  it('renders the followed posts in descending order by date', () => {
    renderWithStore(<FollowedPostList />, {
      preloadedState: { followedPosts: mockFollowedPosts }
    })

    const posts = screen.getAllByText(/followed post/i)
    expect(posts).toHaveLength(2)

    expect(posts[0]).toHaveTextContent('Second followed post')
    expect(posts[1]).toHaveTextContent('First followed post')
  })

  it('renders "Ei julkaisuja saatavilla" when there are no followed posts', () => {
    renderWithStore(<FollowedPostList />, {
      preloadedState: { followedPosts: [] }
    })

    expect(screen.getByText('Ei julkaisuja saatavilla')).toBeInTheDocument()
  })

  it('renders post details correctly', () => {
    renderWithStore(<FollowedPostList />, {
      preloadedState: { followedPosts: [mockFollowedPosts[0]] }
    })

    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.getByText('Baby1')).toBeInTheDocument()
    expect(screen.getByText('First followed post')).toBeInTheDocument()
    expect(screen.getByAltText('Baby1\'s profilepic')).toHaveAttribute('src', '/baby1.jpg')
    expect(screen.getByAltText('Baby\'s post')).toHaveAttribute('src', '/image1.jpg')
  })
})