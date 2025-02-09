import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FiMessageCircle } from 'react-icons/fi'
import { MdClose } from 'react-icons/md'
import ChatView from './ChatView'

const ChatUserList = () => {
  const loggedUser = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)
  const user = users.find((u) => u.id === loggedUser.id)
  const followedUsers = user.following
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleUserClick = (user) => {
    setSelectedUser(user)
    setIsChatOpen(true)
  }

  const closeChat = () => {
    setIsChatOpen(false)
  }

  return (
    <div className="fixed bottom-4 right-4">
      <button
        className="bg-my-blue text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
        data-testid="close-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMessageCircle size={20} />
        Chat
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
          {followedUsers.length > 0 ? (
            followedUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserClick(user)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded transition"
              >
                {user.username}
              </button>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Ei seurattuja käyttäjiä</p>
          )}
        </div>
      )}
      {isChatOpen && (
        <div
          className="fixed bottom-4 right-72 bg-white shadow-lg p-3 rounded-lg w-80 border h-96 flex flex-col overflow-y-auto"
          data-testid="chat-window"
        >
          <div className="flex-1 overflow-y-auto">
            <ChatView receiver={selectedUser} onClose={closeChat} />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatUserList
