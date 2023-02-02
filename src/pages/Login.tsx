import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAsyncEffect } from '../utils'
import '../styles/auth.css'

import { login as LoginFunction, logout } from '../backend'

const Login = () => {
   const navigate = useNavigate()

   const [log, setLog] = React.useState('')

   const [username, setUsername] = React.useState<string>('')
   const [password, setPassword] = React.useState<string>('')

   useAsyncEffect(logout, []);

   const sendLog = (txt: string) => {
      setLog(txt)
      setTimeout(() => {
         setLog('')
      }, 3000)
   }

   const login = async() => {
      if(!username || !password) {
         sendLog('Please fill in all fields')
         return
      }

      const res: any = await LoginFunction(username, password)
      if(!res.ok) {
         sendLog(res.error)
         return
      }

      navigate('/app')
   }

   const register = () => {
      navigate('/register')
   }

   return (
      <div className="auth">
         <h1>RocketPass</h1>
         <div className="input">
            <i className="bx bx-user-circle"></i>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
         </div>
         <div className="input">
            <i className="bx bxs-key"></i>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
         </div>
         <div className="buttons">
            <button onClick={login}>Login</button>
            <button onClick={register}>Register</button>
         </div>
         <p className={`log ${log && ' show'}`}>{log || <>&nbsp;</>}</p>
      </div>
   )
}

export default Login
