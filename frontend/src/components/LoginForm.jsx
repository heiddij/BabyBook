import { useState, useEffect } from "react"
import loginService from '../services/login'
import { useDispatch } from "react-redux"
import { passUser } from '../reducers/userReducer'
import babyService from '../services/babies'
import Input from './Input'
import { useForm } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { TbArrowBigRight } from 'react-icons/tb'
import { usernamelogin_validation, passwordlogin_validation } from '../utils/inputValidations'
import { BsFillCheckSquareFill, BsFillXSquareFill } from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom"

const LoginForm = () => {
    const methods = useForm()
    const dispatch = useDispatch()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const onSubmit = methods.handleSubmit(async data => {
      try {
        const user = await loginService.login({
          username: data.username,
          password: data.password
        })

        window.localStorage.setItem('loggedUser', JSON.stringify(user))

        babyService.setToken(user.token)
        dispatch(passUser(user))
        methods.reset()
        setSuccess(true)
        setError('')
        navigate('/')
      } catch (exception) {
        setSuccess(false)
        setError(exception.response?.data?.error || 'Jokin meni vikaan')
      }
    })

    return (
      <FormProvider {...methods}>
      <h1>Kirjaudu sisään</h1>
      <form
        onSubmit={e => e.preventDefault()}
        noValidate
        autoComplete="off"
      >
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