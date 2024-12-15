import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBaby } from '../reducers/babyReducer'
import Input from './Input'
import { useForm } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { GrMail } from 'react-icons/gr'
import { firstname_validation, lastname_validation, birthdate_validation, birthplace_validation } from '../utils/inputValidations'
import { BsFillCheckSquareFill } from 'react-icons/bs'

const BabyForm = () => {
    const methods = useForm()
    const dispatch = useDispatch()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const onSubmit = methods.handleSubmit(data => {
      const newBaby = {
        firstname: data.firstname,
        lastname: data.lastname,
        birthdate: data.birthdate,
        birthplace: data.birthplace
      }

      try {
        dispatch(createBaby(newBaby))
        methods.reset()
        setSuccess(true)
        setError('')
      } catch(exception) {
        setSuccess(false)
        setError(exception.response?.data?.error || 'Jokin meni vikaan')
      }
    })

    return (
      <FormProvider {...methods}>
        <h2>Lisää vauva</h2>
        <form
          onSubmit={e => e.preventDefault()}
          noValidate
          autoComplete="off"
          className="container"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Input {...firstname_validation} />
            <Input {...lastname_validation} />
            <Input {...birthdate_validation} />
            <Input {...birthplace_validation} />
          </div>
          <div className="mt-5">
            {success && (
              <p className="flex items-center gap-1 mb-5 font-semibold text-green-500">
                <BsFillCheckSquareFill /> Vauvan lisäys onnistui
              </p>
            )}
            {error && (
              <p className="flex items-center gap-1 mb-5 font-semibold text-red-500">
                  <BsFillXSquareFill /> {error}
              </p>
            )}
            <button
              onClick={onSubmit}
              className="flex items-center gap-1 p-5 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-800"
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