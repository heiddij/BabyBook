import { useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { BsFillCheckSquareFill, BsFillXSquareFill } from 'react-icons/bs'
import { Box, Button, TextField, Typography } from '@mui/material'

const CommentForm = ({ handleCommentSubmit }) => {
  const methods = useForm()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = methods.handleSubmit(async (data) => {
    const result = await handleCommentSubmit(data)

    if (result.success) {
      methods.reset()
      setSuccess(true)
      setError('')
    } else {
      setSuccess(false)
      setError(result.error || 'Jokin meni vikaan')
    }
  })

  return (
    <FormProvider {...methods}>
      <Box component="form" onSubmit={(e) => e.preventDefault()} noValidate sx={{ mt: 2 }}>
        <TextField
          {...methods.register('comment', { required: 'Kommentti ei voi olla tyhjä' })}
          label="Kirjoita kommentti"
          fullWidth
          multiline
          minRows={2}
          error={!!methods.formState.errors.comment}
          helperText={methods.formState.errors.comment?.message}
          sx={{
            mb: 2,
            '& .MuiInputBase-root': { fontFamily: 'Poppins, sans-serif' },
            '& .MuiInputLabel-root': { fontFamily: 'Poppins, sans-serif' },
            '& .MuiFormHelperText-root': { fontFamily: 'Poppins, sans-serif' },
          }}
        />
        <Box display="flex" alignItems="center" gap={2}>
          <Button variant="contained" onClick={onSubmit} sx={{ backgroundColor: '#B5C0D0', fontFamily: 'Poppins, sans-serif' }}>
            Kommentoi
          </Button>
          {success && (
            <Typography variant="body" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#22C55E' }}>
              <BsFillCheckSquareFill /> Kommentti lähetetty
            </Typography>
          )}
          {error && (
            <Typography variant="body" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#EF4444' }}>
              <BsFillXSquareFill /> {error}
            </Typography>
          )}
        </Box>
      </Box>
    </FormProvider>
  )
}

export default CommentForm