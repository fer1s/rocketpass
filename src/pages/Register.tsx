import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'

import { create_account } from '../backend'

const Register = () => {
   const navigate = useNavigate()

   const [log, setLog] = React.useState('')

   const [username, setUsername] = React.useState<string>('')
   const [password, setPassword] = React.useState<string>('')
   const [confirmPassword, setConfirmPassword] = React.useState<string>('')

   const sendLog = (txt: string) => {
      setLog(txt)
      setTimeout(() => {
         setLog('')
      }, 3000)
   }

   const register = async () => {
      if (!username || !password || !confirmPassword) {
         sendLog('Please fill in all fields')
         return
      }

      if (password !== confirmPassword) {
         sendLog('Passwords do not match')
         return
      }

      const res = await create_account(username, password)
      if (!res.ok) {
         sendLog(res.error)
         return
      }

      navigate('/app')
   }

   const login = () => {
      navigate('/')
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
         <div className="input">
            <i className="bx bxs-key"></i>
            <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
         </div>
         <div className="buttons">
            <button onClick={register}>Register</button>
            <button onClick={login}>Login</button>
         </div>
         <p className={`log ${log && ' show'}`}>{log || <>&nbsp;</>}</p>
      </div>
   )
}

export default Register
