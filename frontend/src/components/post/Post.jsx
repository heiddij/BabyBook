import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Avatar, Box, CardMedia, Typography } from '@mui/material'
import { formatDateTime } from '../../utils/formatDate'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ToggleButton from '@mui/material/ToggleButton'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { likePost, unlikePost } from '../../reducers/postReducer'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import CommentList from '../comment/CommentList'

const Post = ({ user, baby, post }) => {
  const [selected, setSelected] = useState(false)
  const [likes, setLikes] = useState(0)
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.user)

  useEffect(() => {
    if (post.likers) {
      setLikes(post.likers.length)
      const isLiked = post.likers.some((liker) => liker.id === loggedUser.id)
      setSelected(isLiked)
    }
  }, [loggedUser, post.likers])

  const handleLike = () => {
    setSelected(true)
    setLikes(likes + 1)
    dispatch(likePost(post.id))
  }

  const handleUnlike = () => {
    setSelected(false)
    setLikes(likes - 1)
    dispatch(unlikePost(post.id))
  }

  return (
    <>
      <Card sx={{ width: 500, marginY: 4 }} data-testid="post-card">
        <CardContent sx={{ wordWrap: 'break-word', overflow: 'hidden' }}>
          <Box marginBottom={2}>
            <h2 className='text-2xl'>{user.username}</h2>
            <p>{formatDateTime(post.createdAt)}</p>
          </Box>
          <Box display="flex" alignItems="center" gap={1} marginBottom={2}>
            <Avatar sx={{ height: 60, width: 60 }} key={baby.id} alt={`${baby.firstname}'s profilepic`} src={baby.profilepic} />
            <p className='text-xl'>{baby.firstname}</p>
          </Box>
          <p>{post.post}</p>
        </CardContent>
        {post.image &&
          <CardMedia
            sx={{ maxWidth: 400, margin: 2, justifySelf: 'center' }}
            component="img"
            image={post.image}
            alt="Baby's post"
          />
        }
        <Box display="flex" alignItems="center" marginBottom={2}>
          <ToggleButton
            value="check"
            data-testid="like-button"
            selected={selected}
            sx={{ border: 'none', backgroundColor: 'transparent !important', color: '#EED3D9 !important', paddingRight: 0.5 }}
            onChange={selected ? handleUnlike : handleLike}
          >
            {selected ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </ToggleButton>
          {likes > 0 && <Typography>{likes}</Typography>}
        </Box>
        <CommentList post={post} />
      </Card>
    </>
  )
}

export default Post