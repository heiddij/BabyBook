import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { MdClose } from 'react-icons/md'
import messageService from '../../services/messages'
import { createWebSocket, sendMessage, setAllowReconnection } from '../../utils/websocket'
import { formatDateTime } from '../../utils/formatDate'

const ChatView = ({ receiver, onClose }) => {
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const socket = useRef(null)
  const messagesEndRef = useRef(null)
  const loggedUser = useSelector((state) => state.user)

  useEffect(() => {
    if (messagesEndRef.current) {
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
      <div className="absolute top-2 right-2">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800"
        >
          <MdClose size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-4 pt-8">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex flex-col mb-3 max-w-[80%] ${
              message.sender_id === loggedUser.id ? 'ml-auto bg-my-green' : 'mr-auto bg-my-pink'
            } p-3 rounded-xl`}
          >
            <div className="flex justify-between text-xs text-gray-500">
              <span className="font-semibold">{message.sender?.username}</span>
              <span>{formatDateTime(message.createdAt)}</span>
            </div>
            <div className="mt-1">{message.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex p-2 border-t">
        <input
          type="text"
          placeholder="Type a message"
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
          className="p-2 bg-my-blue rounded ml-2 text-white"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatView