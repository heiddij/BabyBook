import { formatDateTime } from '../../utils/formatDate'

const ChatMessage = ({ loggedUser, message }) => {
  return (
    <div
      className={`flex flex-col mb-3 max-w-[80%] ${
        message.sender_id === loggedUser.id ? 'ml-auto bg-my-green' : 'mr-auto bg-my-pink'
      } p-3 rounded-xl`}
      data-testid="speech-bubble"
    >
      <div className="flex justify-between text-xs text-gray-500">
        <span className="font-semibold">{message.sender?.username}</span>
        <span>{formatDateTime(message.createdAt)}</span>
      </div>
      <div className="mt-1">{message.content}</div>
    </div>
  )
}

export default ChatMessage