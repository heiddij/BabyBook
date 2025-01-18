import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import User from './User'

describe('User Component', () => {
  const mockUserWithBabies = {
    id: 1,
    username: 'testuser',
    babies: [
      { id: 1, firstname: 'Baby1', profilepic: '/baby1.jpg' },
      { id: 2, firstname: 'Baby2', profilepic: '/baby2.jpg' }
    ]
  }

  const mockUserWithoutBabies = {
    id: 2,
    username: 'userwithoutbabies',
    babies: []
  }

  const renderUser = (user) => {
    render(
      <MemoryRouter>
        <User user={user} />
      </MemoryRouter>
    )
  }

  it('renders the username and links to the correct user profile', () => {
    renderUser(mockUserWithBabies)

    const username = screen.getByText('testuser')
    expect(username).toBeInTheDocument()

    const link = screen.getByRole('link', { name: /testuser/i })
    expect(link).toHaveAttribute('href', '/users/1')
  })

  it('renders the babies as avatars when the user has babies', () => {
    renderUser(mockUserWithBabies)

    const avatars = screen.getAllByRole('img')
    expect(avatars).toHaveLength(2)

    expect(avatars[0]).toHaveAttribute('alt', 'Baby2\'s profilepic')
    expect(avatars[0]).toHaveAttribute('src', '/baby2.jpg')

    expect(avatars[1]).toHaveAttribute('alt', 'Baby1\'s profilepic')
    expect(avatars[1]).toHaveAttribute('src', '/baby1.jpg')
  })

  it('displays "Ei vielä vauvoja" when the user has no babies', () => {
    renderUser(mockUserWithoutBabies)

    const noBabiesText = screen.getByText('Ei vielä vauvoja')
    expect(noBabiesText).toBeInTheDocument()

    const avatars = screen.queryAllByRole('img')
    expect(avatars).toHaveLength(0)
  })

  it('applies hover effects and transition styles on the card', () => {
    renderUser(mockUserWithBabies)

    const card = screen.getByTestId('user-card')
    expect(card).toHaveClass(
      'transform transition-transform hover:scale-105 hover:shadow-xl'
    )
  })
})
