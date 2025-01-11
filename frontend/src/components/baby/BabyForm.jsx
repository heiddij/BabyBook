import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createBaby, updateBaby } from '../../reducers/babyReducer'
import Input from '../form/Input'
import { useForm } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { GrMail } from 'react-icons/gr'
import { firstname_validation, lastname_validation, birthdate_validation, birthplace_validation, image_validation } from '../../utils/inputValidations'
import { BsFillCheckSquareFill, BsFillXSquareFill } from 'react-icons/bs'

const BabyForm = ({ baby = null }) => {
  const methods = useForm()
  const dispatch = useDispatch()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Set default values if baby data is available (for edit mode)
  useEffect(() => {
    if (baby) {
      methods.setValue('firstname', baby.firstname)
      methods.setValue('lastname', baby.lastname)
      methods.setValue('birthdate', baby.birthdate)
      methods.setValue('birthplace', baby.birthplace)
    }
  }, [baby, methods])

  const onSubmit = methods.handleSubmit(async (data) => {
    const formData = new FormData()
    formData.append('firstname', data.firstname)
    formData.append('lastname', data.lastname)
    formData.append('birthdate', data.birthdate)
    formData.append('birthplace', data.birthplace)

    if (data.image.length > 0) {
      formData.append('profilepic', data.image[0])
    }

    try {
      if (baby) {
        await dispatch(updateBaby(baby.id, formData))
      } else {
        await dispatch(createBaby(formData))
      }
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
      >
        <div className="grid gap-5 grid-cols-1">
          <Input {...firstname_validation} />
          <Input {...lastname_validation} />
          <Input {...birthdate_validation} />
          <Input {...birthplace_validation} />
          <Input {...image_validation} />
        </div>
        <div className="mt-5">
          {success && (
            <p className="flex items-center gap-1 mb-5 font-semibold text-green-500">
              <BsFillCheckSquareFill /> Vauvan tallennus onnistui
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
              Tallenna
          </button>
        </div>
      </form>
    </FormProvider>
  )
}

export default BabyForm