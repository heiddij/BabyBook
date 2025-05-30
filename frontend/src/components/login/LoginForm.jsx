import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { TbArrowBigRight } from 'react-icons/tb'
import { BsFillCheckSquareFill, BsFillXSquareFill } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../form/Input'
import Heading from '../ui/Heading'
import { usernamelogin_validation, passwordlogin_validation } from '../../utils/inputValidations'

const LoginForm = ({ handleLogin }) => {
  const methods = useForm()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = methods.handleSubmit(async data => {
    const result = await handleLogin(data)

    if (result.success) {
      methods.reset()
      setSuccess(true)
      setError('')
      navigate('/')
    } else {
      setSuccess(false)
      setError(result.error || 'Jokin meni vikaan')
    }
  })

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={e => e.preventDefault()}
        noValidate
        autoComplete="off"
        className="my-form"
      >
        <h2>Kirjaudu sisään</h2>
        <div className="grid gap-5 grid-cols-1">
          <Input {...usernamelogin_validation} />
          <Input {...passwordlogin_validation} />
        </div>
        <div className="mt-5">
          {success && (
            <p className="flex items-center gap-1 mb-5 font-semibold text-green-500">
              <BsFillCheckSquareFill /> Kirjautuminen onnistui
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
            <TbArrowBigRight />
          Kirjaudu
          </button>
        </div>
        <div className="mt-5">
          <p>Ei vielä käyttäjätunnusta?</p> <Link to="/registration" className="font-semibold hover:font-bold">Rekisteröidy</Link>
        </div>
      </form>
    </FormProvider>
  )
}

export default LoginForm