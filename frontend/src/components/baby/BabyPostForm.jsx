import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createPost } from '../../reducers/postReducer'
import Input from '../form/Input'
import { useForm } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { GrMail } from 'react-icons/gr'
import { image_validation, post_validation } from '../../utils/inputValidations'
import { BsFillCheckSquareFill, BsFillXSquareFill } from 'react-icons/bs'

const BabyPostForm = ({ baby }) => {
  const methods = useForm()
  const dispatch = useDispatch()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = methods.handleSubmit(async (data) => {
    const formData = new FormData()
    formData.append('post', data.post)

    if (data.image.length > 0) {
      formData.append('image', data.image[0])
    }

    try {
      await dispatch(createPost(baby.id, formData))
      methods.reset()
      setSuccess(true)
      setError('')
    } catch (exception) {
      setSuccess(false)
      setError(exception.response?.data?.error || 'Jokin meni vikaan')
    }
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={e => e.preventDefault()}
        noValidate
        autoComplete="off"
        className='my-4'
      >
        <h2>Tee julkaisu!</h2>
        <div className="grid gap-5 grid-cols-1">
          <Input {...post_validation} />
          <Input {...image_validation} />
        </div>
        <div className="mt-5">
          {success && (
            <p className="flex items-center gap-1 mb-5 font-semibold text-green-500">
              <BsFillCheckSquareFill /> Julkaisu onnistui
            </p>
          )}
          {error && (
            <p className="flex items-center gap-1 mb-5 font-semibold text-red-500">
              <BsFillXSquareFill /> {error}
            </p>
          )}
          <button
            onClick={onSubmit}
            className="btn-primary"
          >
            <GrMail />
                  Julkaise
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

export default BabyPostForm