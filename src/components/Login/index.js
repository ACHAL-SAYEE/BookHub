import {useState} from 'react'
import {useHistory, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Login = () => {
  const history = useHistory()

  const [Username, setUsername] = useState('')
  const [Password, setPassword] = useState('')
  const [showSubmitError, setshowSubmitError] = useState(false)
  const [errorMsg, seterrorMsg] = useState('')

  const ValidateUser = async e => {
    e.preventDefault()
    const apiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username: Username, password: Password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const responseData = await response.json()
    if (response.ok) {
      Cookies.set('jwt_token', responseData.jwt_token, {
        expires: 30,
        path: '/',
      })
      history.replace('/')
    } else {
      seterrorMsg(responseData.error_msg)
      setshowSubmitError(true)
    }
  }
  const jwt_token = Cookies.get('jwt_token')
  if (jwt_token !== undefined) {
    return <Redirect to="/" />
  }
  return (
    <div className="bg">
      <img
        src="./Login.png"
        className="login-image"
        alt="login website logo"
        // style={{height: '100px'}}
      />
      <div className="box">
        <img src="./logo.png" alt="website login" />
        <form onSubmit={ValidateUser}>
          <div className="InputField">
            <label htmlFor="Username">Username</label>
            <input
              id="Username"
              className="inputEl"
              onChange={e => {
                setUsername(e.target.value)
              }}
            />
          </div>
          <div className="InputField">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              id="Password"
              className="inputEl"
              onChange={e => {
                setPassword(e.target.value)
              }}
            />
          </div>
          {setshowSubmitError && <p>{errorMsg}</p>}
          <button className="loginBtn" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
