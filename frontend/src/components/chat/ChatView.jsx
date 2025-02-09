import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { MdClose } from 'react-icons/md'
import messageService from '../../services/messages'
import { createWebSocket, sendMessage, setAllowReconnection } from '../../utils/websocket'
import ChatMessage from './ChatMessage'

const ChatView = ({ receiver, onClose }) => {
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const socket = useRef(null)
  const messagesEndRef = useRef(null)
  const loggedUser = useSelector((state) => state.user)

  useEffect(() => {
    if (messagesEndRef.current?.scrollIntoView) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [receiver, messages])

  useEffect(() => {
    const fetchMessages = async () => {
      if (!loggedUser) return

      try {
        const userMessages = await messageService.getUserMessages(receiver.id)
        setMessages(userMessages)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()
  }, [loggedUser, receiver])

  useEffect(() => {
    if (!loggedUser) {
      setAllowReconnection(false)
      return
    }

    setAllowReconnection(true)
    socket.current = createWebSocket('ws://localhost:3005', {
      onMessage: (msg) => setMessages((prevMessages) => [...prevMessages, msg])
    })

    return () => {
      if (socket.current) {
        socket.current.close()
        console.log('Disconnected')
      }
    }
  }, [loggedUser])

  const handleSendMessage = () => {
    if (messageInput.trim() === '') return

    const message = {
      senderId: loggedUser.id,
      receiverId: receiver.id,
      content: messageInput
    }

    sendMessage(socket.current, message)
    setMessageInput('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="absolute top-0 right-0">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
          data-testid="chat-close-button"
        >
          <MdClose size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 pt-8">
        {messages.map((message, index) => (
          <ChatMessage key={index} loggedUser={loggedUser} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t">
        <input
          type="text"
          placeholder="Kirjoita viesti"
          className="p-2 border rounded flex-grow"
          maxLength={200}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && messageInput.trim() !== '') {
              handleSendMessage()
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className="px-2 bg-my-blue rounded text-white"
        >
          Lähetä
        </button>
      </div>
    </div>
  )
}

export default ChatView