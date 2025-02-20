import  { createContext, useEffect, useState } from 'react'
import { auth, provider } from '../firebase'; // Import Firebase auth
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
export const AuthContext = createContext()
export default function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    useEffect(()=>{
        const unsubscribe=()=>{
          onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser)
          
          })
        }
        return unsubscribe()
      }, [])
      const handleSignIn = async () => {
        try {
          await signInWithPopup(auth, provider);
        } catch (error) {
          console.error('Error signing in', error);
        }
      };
      const handleSignOut = async () => {
        try {
          await signOut(auth);
        } catch (error) {
          console.error('Error signing out', error);
        }
      };
      const AuthInfo = {
        handleSignIn,
        handleSignOut,
        user
      }
  return (
    <div>
      return (
    <div>
        <AuthContext.Provider value={AuthInfo}>
        {children}
        </AuthContext.Provider>
      
       
      
    </div>
  )
    </div>
  )
}
