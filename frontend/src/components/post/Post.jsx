import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Avatar, Box, CardMedia, Typography } from '@mui/material'
import { formatDateTime } from '../../utils/formatDate'

const Post = ({ user, baby, post }) => {
  return (
    <>
      <Card sx={{ width: 500, marginY: 4 }}>
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
        <CardMedia
          sx={{ maxWidth: 400, margin: 2, justifySelf: 'center' }}
          component="img"
          image={post.image}
          alt="Baby's post"
        />
      </Card>
    </>
  )
}

export default Post