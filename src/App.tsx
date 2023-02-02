import { Routes, Route } from 'react-router-dom'
import './styles/app.css'

import Login from './pages/Login';
import Register from './pages/Register';
import AppPage from './pages/App';
import Add from './pages/Add';

function App() {

  return (
    <div className="main">
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="app">
            <Route index element={<AppPage />} />
            <Route path="add" element={<Add />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
