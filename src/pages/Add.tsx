import React from 'react'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import { useAsyncEffect } from '../utils'
import '../styles/add.css'
import { add_credentials, generate_password } from '../backend'

const pwCharColor = (c: string) => ('!@#$%^&*'.includes(c) ? '#57c7ff' : '0123456789'.includes(c) ? '#ffbc58' : '#ffffff')

const Add = () => {
   const navigate = useNavigate()

   const [log, setLog] = React.useState('')
   const [show, setShow] = React.useState(false)
   const [generateModalOpen, setGenerateModalOpen] = React.useState(false)
   const [length, setLength] = React.useState(16)
   const [types, setTypes] = React.useState(['lowercase', 'uppercase', 'digits', 'special'])

   const [name, setName] = React.useState('')
   const [username, setUsername] = React.useState('')
   const [password, setPassword] = React.useState('')

   useAsyncEffect(async () => {
      if (!generateModalOpen) return
      const res = await generate_password(length, types)
      console.log(res)
      if (!res.ok) {
         sendLog('Error generating password')
         return
      }
      setPassword(res.value)
   }, [generateModalOpen, length, types])

   const updateLength = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value)
      if (isNaN(val)) return
      setLength(val)
   }

   const toggleType = (type: string) => {
      if (types.length === 1 && types.includes(type)) return
      if (types.some((e) => e === type)) {
         setTypes(types.filter((e) => e !== type))
      } else {
         setTypes([...types, type])
      }
      console.log(types)
   }

   const showPassword = () => {
      setShow(!show)
   }

   const openGenerateModal = () => {
      setGenerateModalOpen(true)
   }
   const closeGenerateModal = () => {
      setGenerateModalOpen(false)
   }

   const sendLog = (txt: string) => {
      setLog(txt)
      setTimeout(() => {
         setLog('')
      }, 3000)
   }

   const add = async () => {
      if (!name || !username || !password) {
         sendLog('Please fill all the fields')
         return
      }

      const res = await add_credentials(name, username, password)
      if (!res.ok) {
         sendLog('Error adding credentials')
         return
      }

      navigate('/app')
   }

   return (
      <div className="add_page">
         <h1 className="title">Add Credentials</h1>
         <div className="input">
            <i className="bx bx-cuboid"></i>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
         </div>
         <div className="input">
            <i className="bx bx-envelope"></i>
            <input type="text" placeholder="Username / E-mail" value={username} onChange={(e) => setUsername(e.target.value)} />
         </div>
         <div className="input">
            <i className="bx bxs-key"></i>
            <input type={show ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={showPassword}>
               <i className="bx bx-show"></i>
            </button>
         </div>
         <button className="add" onClick={add}>
            Add
         </button>
         <button className="generate" onClick={openGenerateModal}>
            Generate password
         </button>
         <button className='cancel' onClick={() => navigate('/app')}>Cancel</button>
         <p className={`log ${log && ' show'}`}>{log || <>&nbsp;</>}</p>

         <Modal isOpen={generateModalOpen} className="Modal" overlayClassName="Overlay" ariaHideApp={false}>
            <div className="modal_header">
               <h1>Generate password</h1>
               <button onClick={closeGenerateModal}>Close</button>
            </div>
            <div className="modal_body">
               <div className="password">
                  <p>
                     {[...(password.length <= 33 ? password : `${password.substring(0, 33 - 3)}...`)].map((c) => (
                        <span style={{ color: pwCharColor(c) }}>{c}</span>
                     ))}
                  </p>
               </div>
               <div className="options">
                  <div className="input">
                     <i className="bx bx-layer"></i>
                     <input type="number" placeholder="Length" min={10} max={128} value={length} onChange={updateLength} />
                  </div>
                  <div className="selection">
                     <i className="bx bx-shield"></i>
                     <div className="buttons">
                        <button className={types.some((e) => e === 'lowercase') ? 'active' : ''} onClick={() => toggleType('lowercase')}>
                           Lowercase
                        </button>
                        <button className={types.some((e) => e === 'uppercase') ? 'active' : ''} onClick={() => toggleType('uppercase')}>
                           Uppercase
                        </button>
                        <button className={types.some((e) => e === 'digits') ? 'active' : ''} onClick={() => toggleType('digits')}>
                           Digits
                        </button>
                        <button className={types.some((e) => e === 'special') ? 'active' : ''} onClick={() => toggleType('special')}>
                           Special
                        </button>
                     </div>
                  </div>
                  <button className="ok" onClick={closeGenerateModal}>
                     Ok
                  </button>
               </div>
            </div>
         </Modal>
      </div>
   )
}

export default Add
