import  { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import styled from 'styled-components';

export default function Login() {
    const {handleSignIn, handleSignOut, user} = useContext(AuthContext);
    const TextColor = styled.div`
  font-size: 20px;
background-color: green;
  margin-top: 15px;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: center;
 
`;
  return (
  <div>

  
     <div>
       
       {
           user?<TextColor><button  onClick={handleSignOut}>signout with google</button> </TextColor> :
        <TextColor> <button  onClick={handleSignIn}>signin with google</button> <h1>Task Management App </h1></TextColor>
       }
    
    
   </div>
    
  </div>
  )
}
