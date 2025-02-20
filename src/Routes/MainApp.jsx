import  { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import Login from './Login'
import App from '../App'

export default function MainApp() {
    const { user } = useContext(AuthContext);
  
  return(
    <div>
        {
            !user? <Login></Login> : <App></App>
        }
    </div>
  )
  }
