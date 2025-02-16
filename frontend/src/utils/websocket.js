let socket = null

export const getWebSocket = (url) => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket(url)

    socket.onopen = () => console.log('WebSocket connected')
    socket.onclose = () => console.log('WebSocket disconnected')
    socket.onerror = (error) => console.error('WebSocket error:', error)
  }
  return socket
}

export const createWebSocket = (socket, { onMessage }) => {
  socket.addEventListener('message', (event) => {
    if (!event.data) {
      console.error('Received empty message from server')
      return
    }
    try {
      const msg = JSON.parse(event.data)
      if (onMessage) onMessage(msg)
    } catch (error) {
      console.error('Error parsing message:', error, 'Received:', event.data)
    }
  })
  return socket
}

export const sendMessage = (socket, message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  } else {
    console.error('WebSocket is not connected.')
  }
}

export const disconnectWebSocket = () => {
  if (socket) {
    console.log('Disconnecting WebSocket...')
    socket.close()
    socket = null
  }
}