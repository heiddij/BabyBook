import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserList from './components/user/UserList'
import UserView from './components/user/UserView'
import BabyView from './components/baby/BabyView'
import { initializeUsers } from './reducers/usersReducer'
import { initializeBabies } from './reducers/babyReducer'
import { passUser } from './reducers/userReducer'
import { initializeFollowedUsersPosts } from './reducers/followedPostsReducer'
import LoginForm from './components/login/LoginForm'
import babyService from './services/babies'
import postService from './services/posts'
import followService from './services/follow'
import loginService from './services/login'
import commentService from './services/comments'
import messageService from './services/messages'
import UserForm from './components/user/UserForm'
import Navigation from './components/layout/Navigation'
import Spinner from './components/ui/Spinner'
import FollowedPostsList from './components/post/FollowedPostList'
import { useNavigate } from 'react-router-dom'
import ChatView from './components/chat/ChatView'
import ChatUserList from './components/chat/ChatUserList'
import Heading from './components/ui/Heading'
import { disconnectWebSocket } from './utils/websocket'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(initializeUsers()),
          dispatch(initializeBabies()),
        ])

        const loggedUserJSON = window.localStorage.getItem('loggedUser')

        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          dispatch(passUser(user))

          babyService.setToken(user.token)
          postService.setToken(user.token)
          followService.setToken(user.token)
          commentService.setToken(user.token)
          messageService.setToken(user.token)

          dispatch(initializeFollowedUsersPosts())

          setLoading(false)

          const interval = setInterval(() => {
            dispatch(initializeFollowedUsersPosts())
          }, 100000)

          return () => clearInterval(interval)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error during initialization:', error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [dispatch])

  if (loading) {
    return <Spinner />
  }

  const handleLogin = async (data) => {
    try {
      const user = await loginService.login({
        username: data.username,
        password: data.password,
      })

      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      babyService.setToken(user.token)
      postService.setToken(user.token)
      followService.setToken(user.token)
      commentService.setToken(user.token)
      messageService.setToken(user.token)

      dispatch(passUser(user))
      await dispatch(initializeFollowedUsersPosts())

      return { success: true, error: null }
    } catch (exception) {
      const errorMessage = exception.response?.data?.error || 'Jokin meni vikaan'
      return { success: false, error: errorMessage }
    }
  }

  const handleLogout = () => {
    disconnectWebSocket()
    window.localStorage.clear()
    babyService.setToken(null)
    postService.setToken(null)
    followService.setToken(null)
    commentService.setToken(null)
    messageService.setToken(null)
    dispatch(passUser(null))
    navigate('/login')
  }

  return (
    <div>
      { user && <Navigation handleLogout={handleLogout} user={user} /> }
      <Heading />
      <Routes>
        <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
        <Route path="/" element={user ? <FollowedPostsList /> : <Navigate replace to="/login" />} />
        <Route path="/users/:id" element={<UserView />} />
        <Route path="/users/:id/:babyId" element={<BabyView />} />
        <Route path="/registration" element={<UserForm />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/chat/:id" element={<ChatView />} />
      </Routes>
      { user && <ChatUserList /> }
    </div>
  )
}

export default App
