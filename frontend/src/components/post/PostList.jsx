import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import Post from './Post'
import { initializeUserPosts } from '../../reducers/postReducer'

const Posts = ({ baby, user }) => {
  const posts = useSelector((state) => state.posts)
  const babyPosts = posts.filter((p) => p.babyId === baby.id)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeUserPosts(user.id))
  }, [user.id, dispatch])

  const sortedPosts = babyPosts
    ? [...babyPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : []

  if (!babyPosts) {
    return null
  }

  return (
    <>
      {sortedPosts.map((post) => <Post key={post.id} user={user} baby={baby} post={post} />)}
    </>
  )
}

export default Posts