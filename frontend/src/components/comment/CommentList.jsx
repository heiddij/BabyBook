import { Box, Typography, IconButton } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommentForm from './CommentForm'
import { createComment } from '../../reducers/commentReducer'
import { initializePostComments, makeSelectPostComments } from '../../reducers/commentReducer'
import Comment from './Comment'
import Spinner from '../ui/Spinner'

const CommentList = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const selectPostComments = useMemo(() => makeSelectPostComments(), [])
  const postComments = useSelector((state) => selectPostComments(state, post.id))

  useEffect(() => {
    dispatch(initializePostComments(post.id))
  }, [post, dispatch])

  const handleCommentSubmit = async (data) => {
    setLoading(true)

    try {
      await dispatch(createComment(post.id, data.comment))
      return { success: true, error: null }
    } catch (exception) {
      const errorMessage = exception.response?.data?.error || 'Jokin meni vikaan'
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const toggleComments = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <Box sx={{ p: 2, borderTop: '1px solid #ccc' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>
          Kommentit
        </Typography>
        <IconButton onClick={toggleComments} size="small" aria-label={isExpanded ? 'Collapse comments' : 'Expand comments'}>
          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>
      {isExpanded && (
        <>
          <div>
            {postComments.length > 0 ? (
              postComments.map((comment) => loading ? <Spinner key={comment.id} /> : <Comment key={comment.id} comment={comment} />)
            ) : (
              <p>Ei vielä kommentteja</p>
            )}
          </div>
          <CommentForm key={post.id} handleCommentSubmit={handleCommentSubmit} />
        </>
      )}
    </Box>
  )
}

export default CommentList