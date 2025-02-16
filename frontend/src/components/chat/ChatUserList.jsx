import { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { FiMessageCircle } from 'react-icons/fi'
import { MdClose } from 'react-icons/md'
import Badge from '@mui/material/Badge'
import ChatView from './ChatView'
import messageService from '../../services/messages'
import { getWebSocket } from '../../utils/websocket'

const ChatUserList = () => {
  const loggedUser = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const user = users.find((u) => u.id === loggedUser?.id)
  const followedUsers = user?.following || []
  const followers = user.followers || []
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState({})
  const socket = useRef(null)

  const followerIds = new Set(followers.map(user => user.id))
  const mutualFollowers = followedUsers.filter(user => followerIds.has(user.id))

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      if (!loggedUser) return

      try {
        const unreadArray = await messageService.getUnreadMessages()

        const unreadObject = unreadArray.reduce((acc, message) => {
          if (!acc[message.sender_id]) {
            acc[message.sender_id] = []
          }
          acc[message.sender_id].push(message.id)
          return acc
        }, {})

        setUnreadMessages(unreadObject)
      } catch (error) {
        console.error('Error fetching unread messages:', error)
      }
    }

    fetchUnreadCounts()
  }, [loggedUser])

  useEffect(() => {
    if (!loggedUser) return

    if (!socket.current) {
      socket.current = getWebSocket('ws://localhost:3005')
    }

    const unreadListener = async (event) => {
      if (!event.data) return

      try {
        const message = JSON.parse(event.data)
        if (message.receiver_id === loggedUser.id) {
          setUnreadMessages((prev) => {
            if (selectedUser?.id === message.sender_id) {
              messageService.markMessagesAsSeen([message.id]).catch(console.error)
              return prev
            }
            return {
              ...prev,
              [message.sender_id]: [...(prev[message.sender_id] || []), message.id],
            }
          })
        }
      } catch (error) {
        console.error('Error parsing message:', error, 'Received:', event.data)
      }
    }

    socket.current.addEventListener('message', unreadListener)

    return () => {
      socket.current.removeEventListener('message', unreadListener)
    }
  }, [loggedUser, selectedUser])

  if (!loggedUser) return null

  const handleUserClick = async (user) => {
    setSelectedUser(user)
    setIsChatOpen(true)

    if (unreadMessages[user.id]?.length > 0) {
      try {
        await messageService.markMessagesAsSeen(unreadMessages[user.id])
        setUnreadMessages((prev) => {
          const updated = { ...prev }
          delete updated[user.id]
          return updated
        })
      } catch (error) {
        console.error('Error marking messages as seen:', error)
      }
    }
  }


  const closeChat = () => {
    setIsChatOpen(false)
    setSelectedUser(null)
  }

  return (
    <div className="fixed bottom-4 right-4">
      <button
        className="bg-my-blue text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        data-testid="close-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMessageCircle size={20} />
        Chat {Object.keys(unreadMessages).length > 0 && <Badge variant="dot" color="error" sx={{ marginLeft: '0.5rem' }} />}
      </button>
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-white shadow-lg p-3 rounded-lg w-64 max-h-80 overflow-y-auto border">
          <div className="absolute top-2 right-2">
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <MdClose size={24} />
            </button>
          </div>
          <h2 className="text-lg font-semibold border-b pb-2 mb-2">Keskustelut</h2>
          {mutualFollowers.length > 0 ? (
            mutualFollowers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition"
              >
                {user.username} {unreadMessages[user.id]?.length > 0 &&
                <Badge badgeContent={`${unreadMessages[user.id].length}`} color="error" sx={{ marginLeft: 1.5, marginBottom: 0.3 }} />}
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Ei seurattuja käyttäjiä. Kahden käyttäjän tulee seurata toisiaan voidakseen keskustella chatissa.</p>
          )}
        </div>
      )}
      {isChatOpen && (
        <div
          className="fixed bottom-4 right-72 bg-white shadow-lg p-3 rounded-lg w-80 border h-96 flex flex-col overflow-y-auto"
          data-testid="chat-window"
        >
          <div className="flex-1 overflow-y-auto">
            <ChatView receiver={selectedUser} onClose={closeChat} socket={socket.current} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatUserList
