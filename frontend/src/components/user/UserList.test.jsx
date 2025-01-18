import { screen } from '@testing-library/react'
import { describe, it, vi, expect, beforeEach } from 'vitest'
import { renderWithStore } from '../../utils/test-utils'
import UserList from './UserList'

vi.mock('./User', () => ({
  default: ({ user }) => <div>{user.name}</div>,
}))

describe('UserList Component', () => {
  it('renders the title correctly', () => {
    renderWithStore(<UserList />)

    expect(screen.getByText('BabyBook käyttäjät')).toBeInTheDocument()
  })

  it('renders the correct message when there are no users', () => {
    renderWithStore(<UserList />, {
      preloadedState: { users: [] },
    })

    expect(
      screen.getByText('Babybookilla ei ole vielä käyttäjiä!')
    ).toBeInTheDocument()
  })

  it('renders a list of users when users exist', () => {
    const mockUsers = [
      { id: 1, name: 'User One' },
      { id: 2, name: 'User Two' },
      { id: 3, name: 'User Three' },
    ]

    renderWithStore(<UserList />, {
      preloadedState: { users: mockUsers },
    })

    mockUsers.forEach((user) => {
      expect(screen.getByText(user.name)).toBeInTheDocument()
    })
  })
})