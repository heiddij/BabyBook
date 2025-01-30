import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import messageService from '../../services/messages'

const ChatView = () => {
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const socket = useRef(null)
  const loggedUser = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const id = useParams().id
  const receiver = users.find((u) => u.id === Number(id))

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
    if (!loggedUser) return

    const connectWebSocket = () => {
      socket.current = new WebSocket('ws://localhost:3005')

      socket.current.onopen = () => {
        console.log('Connected to WebSocket')
      }

      socket.current.onclose = () => {
        console.log('Disconnected, attempting to reconnect in 3 seconds...')

        setTimeout(() => {
          if (socket.current.readyState === WebSocket.CLOSED && loggedUser) {
            connectWebSocket()
          }
        }, 3000)
      }

      socket.current.onmessage = (event) => {
        if (!event.data) {
          console.error('Received empty message from server')
          return
        }

        try {
          const msg = JSON.parse(event.data)
          setMessages((prevMessages) => [...prevMessages, msg])
        } catch (error) {
          console.error('Error parsing message:', error, 'Received:', event.data)
        }
      }
    }

    connectWebSocket()

    return () => {
      if (socket.current) {
        socket.current.onclose = null
        socket.current.close()
      }
    }
  }, [loggedUser])

  const sendMessage = () => {
    if (messageInput.trim() === '') {
      return
    }

    const message = {
      senderId: loggedUser.id,
      receiverId: receiver.id,
      content: messageInput,
    }

    console.log(message)

    socket.current.send(JSON.stringify(message))
    setMessageInput('')
  }

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className="message sent">
              <span className="message-timestamp">{message.sender?.username}: </span>
              <span className="message-content">{message.content}</span>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your message"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && messageInput.trim() !== '') {
                sendMessage()
              }
            }}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  )
}

export default ChatView