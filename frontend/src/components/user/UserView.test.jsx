import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import UserView from './UserView'
import { renderWithStore } from '../../utils/test-utils'
import { followUser, unfollowUser } from '../../reducers/usersReducer'

vi.mock('../baby/Baby', () => ({
  default: ({ baby, userId, isFollowing }) => (
    <div>
      {baby.name} (userId: {userId}, isFollowing: {isFollowing ? 'true' : 'false'})
    </div>
  ),
}))

vi.mock('../baby/BabyForm', () => ({
  default: () => <div>Baby Form</div>,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
  }
})

vi.mock('../../reducers/usersReducer', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: actual.default,
    followUser: vi.fn(() => ({ type: 'users/followUser' })),
    unfollowUser: vi.fn(() => ({ type: 'users/unfollowUser' })),
  }
})

describe('UserView Component', () => {
  const mockUsers = [
    { id: 1, username: 'User One', followers: [] },
    { id: 2, username: 'User Two', followers: [{ id: 3 }] },
  ]

  const mockBabies = [
    { id: 1, name: 'Baby One', userId: 1 },
    { id: 2, name: 'Baby Two', userId: 2 },
  ]

  const mockLoggedUser = { id: 3, username: 'Logged User', following: [1] }

  it('renders the user babies', () => {
    renderWithStore(<UserView />, {
      preloadedState: {
        users: mockUsers,
        babies: mockBabies,
        user: mockLoggedUser,
      },
    })

    expect(screen.getByText('Käyttäjän User One vauvat:')).toBeInTheDocument()
    expect(screen.getByText('Baby One (userId: 1, isFollowing: false)')).toBeInTheDocument()
  })

  it('renders fallback when no babies exist', () => {
    renderWithStore(<UserView />, {
      preloadedState: {
        users: mockUsers,
        babies: [],
        user: mockLoggedUser,
      },
    })

    expect(
      screen.getByText('Käyttäjällä ei ole vielä vauvoja lisättynä.')
    ).toBeInTheDocument()
  })

  it('allows the logged-in user to toggle the baby form', () => {
    renderWithStore(<UserView />, {
      preloadedState: {
        users: mockUsers,
        babies: mockBabies,
        user: { id: 1, username: 'Logged User' },
      },
    })

    const toggleButton = screen.getByText('Lisää vauva')
    expect(toggleButton).toBeInTheDocument()

    fireEvent.click(toggleButton)
    expect(screen.getByText('Baby Form')).toBeInTheDocument()

    fireEvent.click(toggleButton)
    expect(screen.queryByText('Baby Form')).not.toBeInTheDocument()
  })

  it('handles follow and unfollow actions', async () => {
    renderWithStore(<UserView />, {
      preloadedState: {
        users: mockUsers,
        babies: mockBabies,
        user: { ...mockLoggedUser, following: [] },
      },
    })

    const followButton = screen.getByText('Seuraa')
    expect(followButton).toBeInTheDocument()

    fireEvent.click(followButton)
    expect(followUser).toHaveBeenCalledWith(3, 1)

    renderWithStore(<UserView />, {
      preloadedState: {
        users: [{ ...mockUsers[0], followers: [{ id: 3 }] }],
        babies: mockBabies,
        user: mockLoggedUser,
      },
    })

    const unfollowButton = screen.getByText('Lopeta seuraaminen')
    expect(unfollowButton).toBeInTheDocument()

    fireEvent.click(unfollowButton)
    expect(unfollowUser).toHaveBeenCalledWith(3, 1)
  })

  it('renders a fallback message if user is not found', () => {
    renderWithStore(<UserView />, {
      preloadedState: {
        users: [],
        babies: mockBabies,
        user: mockLoggedUser,
      },
    })

    expect(screen.getByText('Ladataan käyttäjätietoja...')).toBeInTheDocument()
  })
})
