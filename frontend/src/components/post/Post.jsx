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

const Post = ({ user, baby, post }) => {
  const [selected, setSelected] = useState(false)
  const dispatch = useDispatch()
  const loggedUser = useSelector((state) => state.user)

  useEffect(() => {
    const isLiked = post.likers.some((liker) => liker.id === loggedUser.id)
    setSelected(isLiked)
  }, [loggedUser, post.likers])

  const handleLike = () => {
    setSelected(true)
    dispatch(likePost(post.id))
  }

  const handleUnlike = () => {
    setSelected(false)
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
        <ToggleButton
          value="check"
          selected={selected}
          sx={{ border: 'none', backgroundColor: 'transparent !important', color: '#EED3D9 !important' }}
          onChange={selected ? handleUnlike : handleLike}
        >
          {selected ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </ToggleButton>
      </Card>
    </>
  )
}

export default Post