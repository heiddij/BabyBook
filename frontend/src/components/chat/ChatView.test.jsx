import { screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import ChatView from './ChatView'
import { renderWithStore } from '../../utils/test-utils'
import messageService from '../../services/messages'
import { sendMessage } from '../../utils/websocket'

vi.mock('../../services/messages', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    default: {
      ...actual.default,
      getUserMessages: vi.fn()
    }
  }
})


vi.mock('../../utils/websocket', () => ({
  createWebSocket: vi.fn(() => ({
    close: vi.fn()
  })),
  sendMessage: vi.fn(),
  setAllowReconnection: vi.fn()
}))

describe('ChatView component', () => {
  const receiver = { id: 2, username: 'User Two' }
  const loggedUser = { id: 1, username: 'User One' }
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', async () => {
    messageService.getUserMessages.mockResolvedValue([])

    renderWithStore(<ChatView receiver={receiver} onClose={mockOnClose} />, {
      preloadedState: { user: loggedUser }
    })

    expect(await screen.findByPlaceholderText('Kirjoita viesti')).toBeInTheDocument()
  })

  it('fetches and displays messages', async () => {
    messageService.getUserMessages.mockResolvedValue([
      { senderId: 1, receiverId: 2, content: 'Hello', createdAt: '2025-02-09T12:34:56.789Z' },
      { senderId: 2, receiverId: 1, content: 'Hi there', createdAt: '2025-02-09T12:34:56.789Z' }
    ])

    renderWithStore(<ChatView receiver={receiver} onClose={mockOnClose} />, {
      preloadedState: { user: loggedUser }
    })

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Hi there')).toBeInTheDocument()
    })
  })

  it('closes chat when close button is clicked', () => {
    renderWithStore(<ChatView receiver={receiver} onClose={mockOnClose} />, {
      preloadedState: { user: loggedUser }
    })

    fireEvent.click(screen.getByTestId('chat-close-button'))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('sends message when button is clicked', () => {
    const mockSocket = { send: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() }

    renderWithStore(<ChatView receiver={receiver} onClose={mockOnClose} socket={mockSocket} />, {
      preloadedState: { user: loggedUser }
    })

    fireEvent.change(screen.getByPlaceholderText('Kirjoita viesti'), {
      target: { value: 'Test message' }
    })
    fireEvent.click(screen.getByText('Lähetä'))

    expect(sendMessage).toHaveBeenCalledWith(expect.any(Object), {
      senderId: 1,
      receiverId: 2,
      content: 'Test message'
    })
  })

  it('sends message when Enter key is pressed', () => {
    const mockSocket = { send: vi.fn(), addEventListener: vi.fn(), removeEventListener: vi.fn() }

    renderWithStore(<ChatView receiver={receiver} onClose={mockOnClose} socket={mockSocket} />, {
      preloadedState: { user: loggedUser }
    })

    const input = screen.getByPlaceholderText('Kirjoita viesti')

    fireEvent.change(input, { target: { value: 'Hello Enter' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(sendMessage).toHaveBeenCalledWith(expect.any(Object), {
      senderId: 1,
      receiverId: 2,
      content: 'Hello Enter'
    })
  })
})
