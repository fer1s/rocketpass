import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import './styles/modal.css'

import Bar from './components/Bar'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <BrowserRouter>
      <div className="App">
         <Bar />
         <App />
      </div>
   </BrowserRouter>
)
