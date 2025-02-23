import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { initializeFollowedUsersPosts } from '../../reducers/followedPostsReducer'
import Post from './Post'
import Spinner from '../ui/Spinner'


const FollowedPostsList = () => {
  const dispatch = useDispatch()
  const followedPosts = useSelector((state) => state.followedPosts)
  const loggedUser = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!loggedUser) {
      return
    }
    const fetchData = async () => {
      await dispatch(initializeFollowedUsersPosts())
      setLoading(false)
    }

    fetchData()
  }, [dispatch, loggedUser])

  const sortedPosts = followedPosts
    ? [...followedPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : []

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <div className="container mx-auto flex justify-center items-center flex-col">
        {sortedPosts.length > 0 ? (sortedPosts.map((post) =>
          <Post key={post.id} user={post.followingUser} baby={post.baby} post={post} />
        )) : <p>Ei julkaisuja saatavilla</p>}
      </div>
    </>
  )
}

export default FollowedPostsList