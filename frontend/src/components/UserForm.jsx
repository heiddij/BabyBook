import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createUser } from '../reducers/usersReducer'
import Input from './Input'
import { useForm } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { GrMail } from 'react-icons/gr'
import { BsFillCheckSquareFill, BsFillXSquareFill } from 'react-icons/bs'
import { firstname_validation, lastname_validation, usernamereg_validation, passwordreg_validation } from '../utils/inputValidations'
import { useNavigate } from 'react-router-dom'

const UserForm = () => {
  const methods = useForm()
  const dispatch = useDispatch()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = methods.handleSubmit(async data => {
    const newUser = {
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      password: data.password
    }

    try {
      await dispatch(createUser(newUser))
      methods.reset()
      setSuccess(true)
      setError('')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (exception) {
      setSuccess(false)
      setError(exception.response?.data?.error || 'Jokin meni vikaan')
    }
  })

  return (
    <FormProvider {...methods}>
      <h1>Rekisteröidy</h1>
      <form
        onSubmit={e => e.preventDefault()}
        noValidate
        autoComplete="off"
        className="container"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Input {...firstname_validation} />
          <Input {...lastname_validation} />
          <Input {...usernamereg_validation} />
          <Input {...passwordreg_validation} />
        </div>
        <div className="mt-5">
          {success && (
            <p className="flex items-center gap-1 mb-5 font-semibold text-green-500">
              <BsFillCheckSquareFill /> Käyttäjän rekisteröinti onnistui
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

export default UserForm