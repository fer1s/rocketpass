import Modal from 'react-modal'
import { Credentials, get_credentials_info } from '../backend'
import { useAsyncEffect } from '../utils'
import { useState } from 'react'

const CredentialsDialog = ({ name, close }: { name: string; close: () => void }) => {
   const [{ username, password }, setCredentialsDetails] = useState<Credentials>({ username: '', password: '' })

   useAsyncEffect(async () => {
      if (!name) return
      const res = await get_credentials_info(name)
      if (!res.ok) {
         console.log(res.error)
         return
      }
      setCredentialsDetails(res.value)
   }, [name])

   return (
      <Modal isOpen={name !== ''} className="Modal" overlayClassName="Overlay" ariaHideApp={false}>
         <div className="modal_header">
            <h1>{name}</h1>
            <button onClick={() => close()}>Close</button>
         </div>
         <div className="modal_body credentials_show">
            <h2>Name</h2>
            <p>{name}</p>
            <h2>Username / E-mail</h2>
            <p>{username}</p>
            <h2>Password</h2>
            <p>{password}</p>
         </div>
      </Modal>
   )
}

export default CredentialsDialog
