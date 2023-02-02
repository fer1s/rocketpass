import { useNavigate } from 'react-router-dom'
import { useAsyncEffect } from '../utils'
import Modal from 'react-modal'
import CredentialsDialog from '../components/CredentialsDialog'
import { fetch_credentials, remove_credentials, copy_to_clipboard } from '../backend'
import React from 'react'

import '../styles/app_page.css'

const App = () => {
   const navigate = useNavigate()

   const [log, setLog] = React.useState('')

   const [credentials, setCredentials] = React.useState([] as string[])
   const [credentialsToRemove, setCredentialsToRemove] = React.useState('')
   const [credentialsToShow, setCredentialsToShow] = React.useState('')

   const showLog = (message: string) => {
      setLog(message)
      setTimeout(() => {
         setLog('')
      }, 3000)
   }

   const populateCredentials = async () => {
      const res = await fetch_credentials()
      if (!res.ok) {
         showLog(res.error)
         return
      }
      setCredentials(res.value)
   }

   useAsyncEffect(populateCredentials, [])

   const copyValue = async (name: string, thing: 'username' | 'password') => {
      const res = await copy_to_clipboard(name, thing)
      if (!res.ok) {
         showLog(res.error)
         return
      }

      showLog(`Copied ${thing} to clipboard`)
   }

   const onRemoveCredentials = async () => {
      setCredentialsToRemove('')
      const res = await remove_credentials(credentialsToRemove)
      if (!res.ok) {
         showLog(res.error)
         return
      }
      await populateCredentials()
   }

   return (
      <div className="app_page">
         <h1 className="title">Credentials</h1>
         {credentials.length > 0 ? (
            <div className="credentials">
               {credentials.map((name, i) => (
                  <div key={i} className="account">
                     <h1>{name}</h1>
                     <div className="buttons">
                        <button onClick={() => copyValue(name, 'username')}>
                           <i className="bx bx-user"></i>
                        </button>
                        <button onClick={() => copyValue(name, 'password')}>
                           <i className="bx bx-key"></i>
                        </button>
                        <button onClick={() => setCredentialsToRemove(name)}>
                           <i className="bx bx-trash-alt"></i>
                        </button>
                        <button onClick={() => setCredentialsToShow(name)}>
                           <i className="bx bx-dots-horizontal-rounded"></i>
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <h2>Click the button below to add credentials</h2>
         )}

         <button className="add_credentials" onClick={() => navigate('/app/add')}>
            Add Credentials
         </button>
         <p className={`log ${log && ' show'}`}>{log || <>&nbsp;</>}</p>


         <Modal isOpen={credentialsToRemove !== ''} className="Modal" overlayClassName="Overlay" ariaHideApp={false}>
            <div className="modal_body remove">
               <h1>Are you sure you want to remove {credentialsToRemove}?</h1>
               <button className="confirm" onClick={onRemoveCredentials}>Yes, I'm sure</button>
               <button className="cancel" onClick={() => setCredentialsToRemove('')}>Cancel</button>
            </div>
         </Modal>

         <CredentialsDialog name={credentialsToShow} close={() => setCredentialsToShow('')} />
      </div>
   )
}

export default App
