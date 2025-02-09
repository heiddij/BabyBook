import { render, screen } from '@testing-library/react'
import ChatMessage from './ChatMessage'
import { describe, it, expect, vi, beforeAll } from 'vitest'

import * as formatDateTimeModule from '../../utils/formatDate'
vi.spyOn(formatDateTimeModule, 'formatDateTime').mockReturnValue('2025-02-09 12:34:56')

describe('ChatMessage component', () => {
  beforeAll(() => {
    Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
      writable: true,
      value: vi.fn(),
    })
  })

  const loggedUser = { id: 1, username: 'TestUser' }

  const message = {
    sender_id: 2,
    sender: { username: 'OtherUser' },
    content: 'Hello there!',
    createdAt: '2025-02-09T12:34:56.789Z',
  }

  it('should render the message sender, content, and timestamp correctly', () => {
    render(<ChatMessage loggedUser={loggedUser} message={message} />)

    expect(screen.getByText('OtherUser')).toBeInTheDocument()
    expect(screen.getByText('2025-02-09 12:34:56')).toBeInTheDocument()
    expect(screen.getByText('Hello there!')).toBeInTheDocument()
  })

  it('should display the correct style when the message is from the logged-in user', () => {
    const loggedInMessage = { ...message, sender_id: 1 }

    render(<ChatMessage loggedUser={loggedUser} message={loggedInMessage} />)

    expect(screen.getByText('Hello there!')).toBeInTheDocument()
    expect(screen.getByTestId('speech-bubble')).toHaveClass('ml-auto bg-my-green')
  })

  it('should display the correct style when the message is not from the logged-in user', () => {
    render(<ChatMessage loggedUser={loggedUser} message={message} />)

    expect(screen.getByText('Hello there!')).toBeInTheDocument()
    expect(screen.getByTestId('speech-bubble')).toHaveClass('mr-auto bg-my-pink')
  })

  it('should call formatDateTime correctly', () => {
    render(<ChatMessage loggedUser={loggedUser} message={message} />)

    expect(formatDateTimeModule.formatDateTime).toHaveBeenCalledWith('2025-02-09T12:34:56.789Z')
  })
})