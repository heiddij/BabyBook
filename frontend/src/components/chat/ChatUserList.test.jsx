import { screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ChatUserList from '../../components/chat/ChatUserList'
import { renderWithStore } from '../../utils/test-utils'

const mockUser = {
  id: 1,
  username: 'loggedUser',
  following: [
    { id: 2, username: 'user1' },
    { id: 3, username: 'user2' }
  ],
  followers: [
    { id: 2, username: 'user1' }
  ]
}

const mockUser2 = {
  id: 4,
  username: 'user3',
  following: [],
  followers: []
}

const preloadedState = {
  user: mockUser,
  users: [mockUser, ...mockUser.following]
}

describe('ChatUserList', () => {
  it('renders the floating chat button', () => {
    renderWithStore(<ChatUserList />, { preloadedState })
    expect(screen.getByText('Chat')).toBeInTheDocument()
  })

  it('opens and closes the user list', async () => {
    renderWithStore(<ChatUserList />, { preloadedState })

    const chatButton = screen.getByText('Chat')
    fireEvent.click(chatButton)
    expect(screen.getByText('Keskustelut')).toBeInTheDocument()

    const closeButton = screen.getByTestId('close-button')
    fireEvent.click(closeButton)
    expect(screen.queryByText('Keskustelut')).not.toBeInTheDocument()
  })

  it('displays following users who are also followers in the user list', () => {
    renderWithStore(<ChatUserList />, { preloadedState })
    fireEvent.click(screen.getByText('Chat'))
    expect(screen.getByText('user1')).toBeInTheDocument()
    expect(screen.queryByText('user2')).not.toBeInTheDocument()
  })

  it('displays info text when there are no followed users', () => {
    renderWithStore(<ChatUserList />, { preloadedState:
      {
        user: mockUser2,
        users: [mockUser2, mockUser, ...mockUser.following]
      }
    })
    fireEvent.click(screen.getByText('Chat'))
    expect(screen.getByText('Ei seurattuja käyttäjiä. Kahden käyttäjän tulee seurata toisiaan voidakseen keskustella chatissa.')).toBeInTheDocument()
  })

  it('opens chat window when clicking a user', () => {
    renderWithStore(<ChatUserList />, { preloadedState })
    fireEvent.click(screen.getByText('Chat'))
    fireEvent.click(screen.getByText('user1'))
    expect(screen.getByTestId('chat-window')).toBeInTheDocument()
  })

  it('closes chat window when clicking close button', () => {
    renderWithStore(<ChatUserList />, { preloadedState })
    fireEvent.click(screen.getByText('Chat'))
    fireEvent.click(screen.getByText('user1'))

    const closeButton = screen.getByTestId('close-button')
    fireEvent.click(closeButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
