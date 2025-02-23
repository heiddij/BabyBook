import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState, lazy, Suspense, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { initializeUsers } from './reducers/usersReducer'
import { initializeBabies } from './reducers/babyReducer'
import { passUser } from './reducers/userReducer'
import { initializeFollowedUsersPosts } from './reducers/followedPostsReducer'
import babyService from './services/babies'
import postService from './services/posts'
import followService from './services/follow'
import loginService from './services/login'
import commentService from './services/comments'
import messageService from './services/messages'
import { disconnectWebSocket } from './utils/websocket'

const UserList = lazy(() => import('./components/user/UserList'))
const UserView = lazy(() => import('./components/user/UserView'))
const LoginForm = lazy(() => import('./components/login/LoginForm'))
const BabyView = lazy(() => import('./components/baby/BabyView'))
const UserForm = lazy(() => import('./components/user/UserForm'))
const FollowedPostsList = lazy(() => import('./components/post/FollowedPostList'))

import Navigation from './components/layout/Navigation'
import Spinner from './components/ui/Spinner'
import Heading from './components/ui/Heading'
import ChatUserList from './components/chat/ChatUserList'

const App = () => {
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const intervalRef = useRef(null)

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

          intervalRef.current = setInterval(() => {
            dispatch(initializeFollowedUsersPosts())
          }, 100000)
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error during initialization:', error.message)
        setLoading(false)
      }
    }

    fetchData()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
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
      {loggedUser && <Navigation handleLogout={handleLogout} user={loggedUser} />}
      <Heading />
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/login" element={<LoginForm handleLogin={handleLogin} />} />
          <Route path="/" element={loggedUser ? <FollowedPostsList /> : <Navigate replace to="/login" />} />
          <Route path="/users/:id" element={<UserView />} />
          <Route path="/users/:id/:babyId" element={<BabyView />} />
          <Route path="/registration" element={<UserForm />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </Suspense>
      {loggedUser && <ChatUserList />}
    </div>
  )
}

export default App
