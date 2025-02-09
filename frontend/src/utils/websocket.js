let allowReconnection = true

export const createWebSocket = (url, { onMessage }) => {
  const socket = new WebSocket(url)

  socket.onopen = () => {
    console.log('Connected to WebSocket')
  }

  socket.onclose = () => {
    allowReconnection && console.log('Disconnected, attempting to reconnect in 3 seconds...')

    setTimeout(() => {
      if (socket.readyState === WebSocket.CLOSED && allowReconnection) {
        createWebSocket(url, { onMessage })
      }
    }, 3000)
  }

  socket.onmessage = (event) => {
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
  }

  return socket
}

export const sendMessage = (socket, message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  } else {
    console.error('WebSocket is not connected.')
  }
}


export const setAllowReconnection = (allow) => {
  allowReconnection = allow
}