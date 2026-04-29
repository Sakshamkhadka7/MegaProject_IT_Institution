import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminProvider'
import { Navigate } from 'react-router-dom';

const AdminProtected = ({children}) => {
 
    const {admin,loading}=useContext(AdminContext);

    if(loading){
        return <h1>Loading .......</h1>
    }

    if(!admin){
        return <Navigate to="/login" replace></Navigate>
    }

  return children
}

export default AdminProtected