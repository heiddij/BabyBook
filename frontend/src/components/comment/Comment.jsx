import { Box, Typography } from '@mui/material'
import { formatDateTime } from '../../utils/formatDate'

const Comment = ({ comment }) => {
  if (!comment) {
    return null
  }

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}
      >
        {comment.user.username}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: '#757575', fontFamily: 'Poppins, sans-serif' }}
      >
        {formatDateTime(comment.createdAt)}
      </Typography>
      <Typography sx={{ mt: 1, fontFamily: 'Poppins, sans-serif' }}>
        {comment.content}
      </Typography>
    </Box>
  )
}

export default Comment