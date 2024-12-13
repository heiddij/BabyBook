import { useState, useEffect } from "react"
import loginService from '../services/login'
import { useDispatch } from "react-redux"
import { passUser } from '../reducers/userReducer'
import babyService from '../services/babies'
import Input from './Input'
import { useForm } from 'react-hook-form'
import { FormProvider } from 'react-hook-form'
import { GrMail } from 'react-icons/gr'
import { username_validation, password_validation } from '../utils/inputValidations'
import { BsFillCheckSquareFill, BsFillXSquareFill } from 'react-icons/bs'

const LoginForm = () => {
    const methods = useForm()
    const dispatch = useDispatch()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)

    // should this be in App.jsx?
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
          dispatch(passUser(user))
          babyService.setToken(user.token)
        }
    }, [])

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
        setError(false)
      } catch (exception) {
        setSuccess(false)
        setError(true)
      }
    })

    return (
      <FormProvider {...methods}>
      <h2>Kirjaudu sisään</h2>
      <form
        onSubmit={e => e.preventDefault()}
        noValidate
        autoComplete="off"
        className="container"
      >
      <div className="grid gap-5 md:grid-cols-2">
        <Input {...username_validation} />
        <Input {...password_validation} />
      </div>
      <div className="mt-5">
        {success && (
          <p className="flex items-center gap-1 mb-5 font-semibold text-green-500">
            <BsFillCheckSquareFill /> Kirjautuminen onnistui
          </p>
        )}
        {error && (
          <p className="flex items-center gap-1 mb-5 font-semibold text-red-500">
            <BsFillXSquareFill /> Väärä käyttäjänimi tai salasana
          </p>
        )}
        <button
          onClick={onSubmit}
          className="flex items-center gap-1 p-5 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-800"
        >
          <GrMail />
          Kirjaudu
        </button>
      </div>
      </form>
      </FormProvider>
    )
}

export default LoginForm